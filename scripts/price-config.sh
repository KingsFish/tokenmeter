#!/bin/bash
#
# price-config.sh - Manage model prices for usage tracking
#
# Usage:
#   ./price-config.sh                    Show current configuration
#   ./price-config.sh --list             List configured models
#   ./price-config.sh --unconfigured     List unconfigured models from transcripts
#   ./price-config.sh add <model> <input> <output>    Add model price
#   ./price-config.sh set <model> <input> <output>    Modify existing model price
#   ./price-config.sh remove <model>                   Remove model price
#   ./price-config.sh default <input> <output>         Set default price
#   ./price-config.sh reset               Reset to plugin defaults
#

set -euo pipefail

# Configuration paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PRICE_CONFIG_USER="${HOME}/.claude/usage-tracker/prices.json"
PRICE_CONFIG_LOCAL="${PROJECT_ROOT}/config/prices.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print usage
print_help() {
    cat << 'EOF'
Usage: price-config.sh [COMMAND] [OPTIONS]

Manage model prices for usage tracking.

Commands:
  (no args)           Show current configuration
  --list              List configured models
  --unconfigured      List unconfigured models from transcripts
  add <model> <input> <output>   Add a new model price
  set <model> <input> <output>   Modify an existing model price
  remove <model>                 Remove a model price
  default <input> <output>       Set the default price
  reset                Reset to plugin defaults
  --help, -h           Show this help message

Arguments:
  model      Model name (e.g., claude-sonnet-4-6)
  input      Input price per million tokens
  output     Output price per million tokens

Examples:
  ./price-config.sh add glm-5 1.0 2.0
  ./price-config.sh set claude-sonnet-4-6 3.5 17.5
  ./price-config.sh remove old-model
  ./price-config.sh default 3.0 15.0
EOF
}

# Check for jq
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required but not installed.${NC}" >&2
        echo "" >&2
        echo "Install jq:" >&2
        echo "  macOS:   brew install jq" >&2
        echo "  Linux:   apt-get install jq or yum install jq" >&2
        exit 1
    fi
}

# Ensure user config exists
ensure_user_config() {
    if [[ ! -f "${PRICE_CONFIG_USER}" ]]; then
        # Create directory if needed
        mkdir -p "$(dirname "${PRICE_CONFIG_USER}")"

        # Copy from local or use defaults
        if [[ -f "${PRICE_CONFIG_LOCAL}" ]]; then
            cp "${PRICE_CONFIG_LOCAL}" "${PRICE_CONFIG_USER}"
            echo -e "${GREEN}Created user config from plugin defaults.${NC}"
        else
            # Create with empty model prices and default values
            jq -n '
                {
                    "model_prices": {},
                    "default_price": {
                        "input_per_million": 3.0,
                        "output_per_million": 15.0
                    }
                }
            ' > "${PRICE_CONFIG_USER}"
            echo -e "${GREEN}Created new user config file.${NC}"
        fi
    fi
}

# Validate price is a positive number
validate_price() {
    local price="$1"
    local name="$2"

    if ! [[ "$price" =~ ^[0-9]+\.?[0-9]*$ ]]; then
        echo -e "${RED}Error: Invalid ${name} price '${price}'. Must be a positive number.${NC}" >&2
        exit 1
    fi

    if (( $(echo "$price <= 0" | bc -l) )); then
        echo -e "${RED}Error: ${name} price must be greater than 0.${NC}" >&2
        exit 1
    fi
}

# Format price for display
format_price() {
    local price="$1"
    printf '$%.2f/M' "$price"
}

# Show current configuration
show_config() {
    ensure_user_config

    # Get unconfigured models from parse-usage.sh
    local unconfigured_models
    unconfigured_models=$("${SCRIPT_DIR}/parse-usage.sh" 2>/dev/null | jq -r '.price_config.unconfigured_models[]' 2>/dev/null || true)

    echo "=== Price Configuration ==="
    echo ""
    echo "Configured Models:"

    # Get models sorted alphabetically
    local models
    models=$(jq -r '.model_prices | keys[]' "${PRICE_CONFIG_USER}" 2>/dev/null | sort)

    if [[ -z "$models" ]]; then
        echo "  (none)"
    else
        while IFS= read -r model; do
            local input_price output_price
            input_price=$(jq -r ".model_prices[\"${model}\"].input_per_million" "${PRICE_CONFIG_USER}")
            output_price=$(jq -r ".model_prices[\"${model}\"].output_per_million" "${PRICE_CONFIG_USER}")
            printf "  %-20s %s input  | %s output\n" "$model" "$(format_price "$input_price")" "$(format_price "$output_price")"
        done <<< "$models"
    fi

    echo ""

    # Default price
    local default_input default_output
    default_input=$(jq -r '.default_price.input_per_million' "${PRICE_CONFIG_USER}")
    default_output=$(jq -r '.default_price.output_per_million' "${PRICE_CONFIG_USER}")
    echo -e "Default Price: ${GREEN}$(format_price "$default_input") input | $(format_price "$default_output") output${NC}"

    # Unconfigured models
    if [[ -n "$unconfigured_models" ]]; then
        echo ""
        echo "Unconfigured Models (detected from transcripts):"
        while IFS= read -r model; do
            if [[ -n "$model" ]]; then
                echo -e "  ${YELLOW}${model}              [No price set]${NC}"
            fi
        done <<< "$unconfigured_models"
    fi
}

# List configured models
list_models() {
    ensure_user_config

    local models
    models=$(jq -r '.model_prices | keys[]' "${PRICE_CONFIG_USER}" 2>/dev/null | sort)

    if [[ -z "$models" ]]; then
        echo "No models configured."
        return
    fi

    echo "Configured Models:"
    while IFS= read -r model; do
        local input_price output_price
        input_price=$(jq -r ".model_prices[\"${model}\"].input_per_million" "${PRICE_CONFIG_USER}")
        output_price=$(jq -r ".model_prices[\"${model}\"].output_per_million" "${PRICE_CONFIG_USER}")
        printf "  %-20s %s input  | %s output\n" "$model" "$(format_price "$input_price")" "$(format_price "$output_price")"
    done <<< "$models"
}

# List unconfigured models
list_unconfigured() {
    ensure_user_config

    local unconfigured_models
    unconfigured_models=$("${SCRIPT_DIR}/parse-usage.sh" 2>/dev/null | jq -r '.price_config.unconfigured_models[]' 2>/dev/null || true)

    if [[ -z "$unconfigured_models" ]]; then
        echo "All detected models have price configurations."
        return
    fi

    echo "Unconfigured Models (detected from transcripts):"
    while IFS= read -r model; do
        if [[ -n "$model" ]]; then
            echo -e "  ${YELLOW}${model}${NC} [No price set]"
        fi
    done <<< "$unconfigured_models"
}

# Add a new model price
add_model() {
    local model="$1"
    local input_price="$2"
    local output_price="$3"

    ensure_user_config

    # Validate prices
    validate_price "$input_price" "input"
    validate_price "$output_price" "output"

    # Check if model already exists
    local exists
    exists=$(jq -r --arg model "$model" '.model_prices[$model] != null' "${PRICE_CONFIG_USER}")

    if [[ "$exists" == "true" ]]; then
        echo -e "${RED}Error: Model '${model}' already exists. Use 'set' to modify.${NC}" >&2
        exit 1
    fi

    # Add the model
    local temp_file
    temp_file=$(mktemp)
    jq --arg model "$model" \
       --argjson input "$input_price" \
       --argjson output "$output_price" \
       '.model_prices[$model] = {"input_per_million": $input, "output_per_million": $output}' \
       "${PRICE_CONFIG_USER}" > "$temp_file"
    mv "$temp_file" "${PRICE_CONFIG_USER}"

    echo -e "${GREEN}Added model '${model}' with input: $(format_price "$input_price"), output: $(format_price "$output_price")${NC}"
}

# Set/modify an existing model price
set_model() {
    local model="$1"
    local input_price="$2"
    local output_price="$3"

    ensure_user_config

    # Validate prices
    validate_price "$input_price" "input"
    validate_price "$output_price" "output"

    # Check if model exists
    local exists
    exists=$(jq -r --arg model "$model" '.model_prices[$model] != null' "${PRICE_CONFIG_USER}")

    if [[ "$exists" == "false" ]]; then
        echo -e "${YELLOW}Warning: Model '${model}' does not exist. Creating new entry.${NC}"
    fi

    # Set the model price
    local temp_file
    temp_file=$(mktemp)
    jq --arg model "$model" \
       --argjson input "$input_price" \
       --argjson output "$output_price" \
       '.model_prices[$model] = {"input_per_million": $input, "output_per_million": $output}' \
       "${PRICE_CONFIG_USER}" > "$temp_file"
    mv "$temp_file" "${PRICE_CONFIG_USER}"

    echo -e "${GREEN}Set model '${model}' to input: $(format_price "$input_price"), output: $(format_price "$output_price")${NC}"
}

# Remove a model price
remove_model() {
    local model="$1"

    ensure_user_config

    # Check if model exists
    local exists
    exists=$(jq -r --arg model "$model" '.model_prices[$model] != null' "${PRICE_CONFIG_USER}")

    if [[ "$exists" == "false" ]]; then
        echo -e "${RED}Error: Model '${model}' not found.${NC}" >&2
        exit 1
    fi

    # Remove the model
    local temp_file
    temp_file=$(mktemp)
    jq --arg model "$model" 'del(.model_prices[$model])' "${PRICE_CONFIG_USER}" > "$temp_file"
    mv "$temp_file" "${PRICE_CONFIG_USER}"

    echo -e "${GREEN}Removed model '${model}'.${NC}"
}

# Set default price
set_default() {
    local input_price="$1"
    local output_price="$2"

    ensure_user_config

    # Validate prices
    validate_price "$input_price" "input"
    validate_price "$output_price" "output"

    # Set default price
    local temp_file
    temp_file=$(mktemp)
    jq --argjson input "$input_price" \
       --argjson output "$output_price" \
       '.default_price = {"input_per_million": $input, "output_per_million": $output}' \
       "${PRICE_CONFIG_USER}" > "$temp_file"
    mv "$temp_file" "${PRICE_CONFIG_USER}"

    echo -e "${GREEN}Set default price to input: $(format_price "$input_price"), output: $(format_price "$output_price")${NC}"
}

# Reset to plugin defaults
reset_config() {
    if [[ -f "${PRICE_CONFIG_LOCAL}" ]]; then
        mkdir -p "$(dirname "${PRICE_CONFIG_USER}")"
        cp "${PRICE_CONFIG_LOCAL}" "${PRICE_CONFIG_USER}"
        echo -e "${GREEN}Reset to plugin defaults from ${PRICE_CONFIG_LOCAL}${NC}"
    else
        # Create with empty model prices and default values
        mkdir -p "$(dirname "${PRICE_CONFIG_USER}")"
        jq -n '
            {
                "model_prices": {},
                "default_price": {
                    "input_per_million": 3.0,
                    "output_per_million": 15.0
                }
            }
        ' > "${PRICE_CONFIG_USER}"
        echo -e "${GREEN}Reset to empty configuration with default prices.${NC}"
    fi
}

# Main logic
check_jq

case "${1:-}" in
    --help|-h)
        print_help
        ;;
    --list)
        list_models
        ;;
    --unconfigured)
        list_unconfigured
        ;;
    add)
        if [[ $# -ne 4 ]]; then
            echo -e "${RED}Error: 'add' requires 3 arguments: <model> <input> <output>${NC}" >&2
            echo "Usage: $0 add <model> <input_price> <output_price>" >&2
            exit 1
        fi
        add_model "$2" "$3" "$4"
        ;;
    set)
        if [[ $# -ne 4 ]]; then
            echo -e "${RED}Error: 'set' requires 3 arguments: <model> <input> <output>${NC}" >&2
            echo "Usage: $0 set <model> <input_price> <output_price>" >&2
            exit 1
        fi
        set_model "$2" "$3" "$4"
        ;;
    remove)
        if [[ $# -ne 2 ]]; then
            echo -e "${RED}Error: 'remove' requires 1 argument: <model>${NC}" >&2
            echo "Usage: $0 remove <model>" >&2
            exit 1
        fi
        remove_model "$2"
        ;;
    default)
        if [[ $# -ne 3 ]]; then
            echo -e "${RED}Error: 'default' requires 2 arguments: <input> <output>${NC}" >&2
            echo "Usage: $0 default <input_price> <output_price>" >&2
            exit 1
        fi
        set_default "$2" "$3"
        ;;
    reset)
        reset_config
        ;;
    "")
        show_config
        ;;
    *)
        echo -e "${RED}Error: Unknown command '${1}'${NC}" >&2
        echo "Run '$0 --help' for usage information." >&2
        exit 1
        ;;
esac