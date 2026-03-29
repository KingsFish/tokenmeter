#!/bin/bash
#
# parse-usage.sh - Parse Claude Code transcript files and output JSON statistics
#
# Usage:
#   ./parse-usage.sh [--project <path>]
#
# Options:
#   --project <path>  Filter by project path (e.g., /Users/zhiquan/code/myproject)
#

set -euo pipefail

# Configuration
CLAUDE_PROJECTS_DIR="${HOME}/.claude/projects"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Price config locations (in order of preference)
PRICE_CONFIG_USER="${HOME}/.claude/tokenmeter/prices.json"
PRICE_CONFIG_LOCAL="${PROJECT_ROOT}/config/prices.json"

# Parse arguments
PROJECT_FILTER=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT_FILTER="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [--project <path>]"
            echo ""
            echo "Options:"
            echo "  --project <path>  Filter by project path"
            exit 0
            ;;
        *)
            echo "Error: Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Check for jq
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed." >&2
    echo "" >&2
    echo "Install jq:" >&2
    echo "  macOS:   brew install jq" >&2
    echo "  Linux:   apt-get install jq or yum install jq" >&2
    exit 1
fi

# Check for Claude projects directory
if [[ ! -d "${CLAUDE_PROJECTS_DIR}" ]]; then
    jq -n '
        {
            "sessions": [],
            "summary": {
                "total_sessions": 0,
                "total_input_tokens": 0,
                "total_output_tokens": 0,
                "total_tokens": 0,
                "total_turns": 0,
                "total_estimated_cost_usd": 0,
                "cost_available_sessions": 0,
                "cost_unavailable_sessions": 0,
                "by_model": {},
                "by_project": {},
                "first_session": null,
                "last_session": null
            },
            "price_config": {
                "configured_models": [],
                "unconfigured_models": []
            },
            "error": "Claude projects directory not found: '"${CLAUDE_PROJECTS_DIR}"'"
        }
    '
    exit 0
fi

# Determine price config file
PRICE_CONFIG_FILE=""
if [[ -f "${PRICE_CONFIG_USER}" ]]; then
    PRICE_CONFIG_FILE="${PRICE_CONFIG_USER}"
elif [[ -f "${PRICE_CONFIG_LOCAL}" ]]; then
    PRICE_CONFIG_FILE="${PRICE_CONFIG_LOCAL}"
fi

# Read price configuration
if [[ -n "${PRICE_CONFIG_FILE}" ]]; then
    PRICE_CONFIG=$(cat "${PRICE_CONFIG_FILE}")
else
    # Default price config
    PRICE_CONFIG='{"model_prices":{},"default_price":{"input_per_million":3.0,"output_per_million":15.0}}'
fi

# Create a temporary file for collecting raw session data
TEMP_FILE=$(mktemp)
WARNINGS_FILE=$(mktemp)
trap 'rm -f "${TEMP_FILE}" "${WARNINGS_FILE}"' EXIT

# Counter for corrupted files
CORRUPTED_COUNT=0

# Find all JSONL files and extract usage data
while IFS= read -r -d '' jsonl_file; do
    # Skip if file doesn't exist or is not readable
    [[ -r "${jsonl_file}" ]] || continue

    # Extract assistant messages with usage info
    # Filter by project if specified
    if ! jq -c '
        select(.type == "assistant" and .message.usage != null) |
        {
            sessionId: .sessionId,
            cwd: .cwd,
            timestamp: .timestamp,
            model: .message.model,
            input_tokens: .message.usage.input_tokens,
            output_tokens: .message.usage.output_tokens
        }
    ' "${jsonl_file}" 2>> "${WARNINGS_FILE}" >> "${TEMP_FILE}"; then
        # jq failed - likely corrupted JSONL
        CORRUPTED_COUNT=$((CORRUPTED_COUNT + 1))
        echo "Warning: Failed to parse ${jsonl_file}" >> "${WARNINGS_FILE}"
    fi
done < <(find "${CLAUDE_PROJECTS_DIR}" -name "*.jsonl" -type f -print0)

# Print warnings if any files were corrupted
if [[ ${CORRUPTED_COUNT} -gt 0 ]]; then
    echo "Warning: ${CORRUPTED_COUNT} JSONL file(s) had parsing errors and were skipped" >&2
fi

# Process collected data with jq
jq -s --argjson priceConfig "${PRICE_CONFIG}" --arg projectFilter "${PROJECT_FILTER}" '
    # Group by sessionId
    def group_by_session:
        group_by(.sessionId) | map({
            session_id: .[0].sessionId,
            entries: .
        });

    # Calculate cost for a model
    def calc_cost(model; input; output):
        if ($priceConfig.model_prices[model] | type) == "object" then
            if $priceConfig.model_prices[model].input_per_million == null or
               $priceConfig.model_prices[model].output_per_million == null then
                null
            else
                ((input / 1000000) * $priceConfig.model_prices[model].input_per_million) +
                ((output / 1000000) * $priceConfig.model_prices[model].output_per_million)
            end
        else
            # Use default price
            ((input / 1000000) * $priceConfig.default_price.input_per_million) +
            ((output / 1000000) * $priceConfig.default_price.output_per_million)
        end;

    # Check if model has price configured
    def has_price_config(model):
        ($priceConfig.model_prices[model] | type) == "object" and
        $priceConfig.model_prices[model].input_per_million != null and
        $priceConfig.model_prices[model].output_per_million != null;

    # Filter by project if specified
    (if $projectFilter != "" then
        map(select(.cwd | index($projectFilter) != null))
    else
        .
    end) |

    # Group by session
    group_by_session |

    # Process each session
    map(
        . as $session |
        {
            session_id: .session_id,
            project_path: .entries[0].cwd,
            project_name: (.entries[0].cwd | split("/") | last // .entries[0].cwd),
            # Use the most common model in the session (or first if tie)
            model: (.entries | group_by(.model) | sort_by(-length) | .[0][0].model),
            input_tokens: (.entries | map(.input_tokens) | add),
            output_tokens: (.entries | map(.output_tokens) | add),
            turns: (.entries | length),
            start_time: (.entries | map(.timestamp) | sort | first),
            end_time: (.entries | map(.timestamp) | sort | last)
        } |
        .total_tokens = (.input_tokens + .output_tokens) |
        .duration_seconds = (
            ((.end_time | split(".")[0] + "Z" | fromdateiso8601) - (.start_time | split(".")[0] + "Z" | fromdateiso8601))
        ) |
        .estimated_cost_usd = calc_cost(.model; .input_tokens; .output_tokens)
    ) |

    # Sort by start_time
    sort_by(.start_time) |

    # Store sessions
    . as $sessions |

    # Build summary
    {
        sessions: $sessions,
        summary: {
            total_sessions: ($sessions | length),
            total_input_tokens: ($sessions | map(.input_tokens) | add // 0),
            total_output_tokens: ($sessions | map(.output_tokens) | add // 0),
            total_tokens: ($sessions | map(.total_tokens) | add // 0),
            total_turns: ($sessions | map(.turns) | add // 0),
            total_estimated_cost_usd: (
                [$sessions[] | select(.estimated_cost_usd != null) | .estimated_cost_usd] | add // 0
            ),
            cost_available_sessions: ([$sessions[] | select(.estimated_cost_usd != null)] | length),
            cost_unavailable_sessions: ([$sessions[] | select(.estimated_cost_usd == null)] | length),
            by_model: (
                $sessions | group_by(.model) | map({
                    key: .[0].model,
                    value: {
                        sessions: length,
                        input: (map(.input_tokens) | add),
                        output: (map(.output_tokens) | add),
                        estimated_cost_usd: (
                            [.[].estimated_cost_usd] | map(select(. != null)) | add // null
                        ),
                        cost_configured: has_price_config(.[0].model)
                    }
                }) | from_entries
            ),
            by_project: (
                $sessions | group_by(.project_name) | map({
                    key: .[0].project_name,
                    value: {
                        sessions: length,
                        input: (map(.input_tokens) | add),
                        output: (map(.output_tokens) | add),
                        estimated_cost_usd: (
                            [.[].estimated_cost_usd] | map(select(. != null)) | add // null
                        )
                    }
                }) | from_entries
            ),
            first_session: (if ($sessions | length) > 0 then $sessions[0].start_time else null end),
            last_session: (if ($sessions | length) > 0 then $sessions[-1].start_time else null end)
        },
        price_config: {
            configured_models: (
                [$sessions[].model] | unique | map(select(has_price_config(.)))
            ),
            unconfigured_models: (
                [$sessions[].model] | unique | map(select(has_price_config(.) | not))
            )
        }
    }
' "${TEMP_FILE}"