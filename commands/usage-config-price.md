---
description: Configure model prices for usage cost tracking
argument-hint: [--list|--unconfigured|add <model> <input> <output>|set <model> <input> <output>|remove <model>|default <input> <output>|reset]
allowed-tools: [Bash]
---

## Price Configuration

Arguments: `$ARGUMENTS`

### Usage

This command manages model price configuration for cost estimation.

**Commands:**
- (no args), `--list`     - Show current configuration
- `--unconfigured`         - List unconfigured models from transcripts
- `add <model> <input> <output>` - Add a new model price
- `set <model> <input> <output>` - Modify an existing model price
- `remove <model>`         - Remove a model price
- `default <input> <output>` - Set the default price (for models without explicit config)
- `reset`                  - Reset to plugin defaults

**Arguments:**
- `model` - Model name (e.g., glm-5, claude-sonnet-4-6)
- `input` - Input price per million tokens (in USD)
- `output` - Output price per million tokens (in USD)

### Examples

```
/usage-config-price                        # Show current config
/usage-config-price --list                 # List configured models
/usage-config-price --unconfigured         # Show models needing config
/usage-config-price add glm-5 1.0 2.0      # Add glm-5 pricing
/usage-config-price set claude-sonnet-4-6 3.0 15.0  # Modify existing
/usage-config-price remove old-model       # Remove a model
/usage-config-price default 3.0 15.0       # Set default price
/usage-config-price reset                  # Reset to defaults
```

### Execute

!`
if [ -z "$ARGUMENTS" ]; then
  ./scripts/price-config.sh
elif [ "$ARGUMENTS" = "--list" ]; then
  ./scripts/price-config.sh --list
elif [ "$ARGUMENTS" = "--unconfigured" ]; then
  ./scripts/price-config.sh --unconfigured
elif echo "$ARGUMENTS" | grep -q "^add "; then
  ./scripts/price-config.sh $(echo "$ARGUMENTS" | sed 's/^add /add /')
elif echo "$ARGUMENTS" | grep -q "^set "; then
  ./scripts/price-config.sh $(echo "$ARGUMENTS" | sed 's/^set /set /')
elif echo "$ARGUMENTS" | grep -q "^remove "; then
  ./scripts/price-config.sh $(echo "$ARGUMENTS" | sed 's/^remove /remove /')
elif echo "$ARGUMENTS" | grep -q "^default "; then
  ./scripts/price-config.sh $(echo "$ARGUMENTS" | sed 's/^default /default /')
elif [ "$ARGUMENTS" = "reset" ]; then
  ./scripts/price-config.sh reset
else
  echo "Unknown command: $ARGUMENTS"
  echo "Run /usage-config-price without arguments for help."
fi
`