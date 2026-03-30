# TokenMeter - Claude Code Token Usage Plugin

A Claude Code plugin that measures your token usage with a CLI summary command and an interactive web dashboard.

## Description

TokenMeter helps you monitor your Claude Code token consumption and estimate costs. It parses Claude Code transcript files stored in `~/.claude/projects` and provides:

- **CLI Summary**: Quick terminal overview of your usage statistics
- **Web Dashboard**: Interactive charts and detailed session history
- **Cost Estimation**: Estimated costs based on configurable model prices

## Features

- Parse all Claude Code session transcripts automatically
- Token usage tracking by model, project, and session
- Cost estimation with configurable model prices
- Interactive web dashboard with:
  - Token usage over time chart
  - Usage breakdown by project and model
  - Session history table with filtering
  - Settings page for price configuration
- Warning when using models without price configuration
- Cross-platform support (macOS, Linux)

## Installation

### Prerequisites

- **jq**: Required for JSON processing
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`

- **Python 3**: Required for the web dashboard server (usually pre-installed)

### Quick Install (Recommended)

Install directly from the marketplace:

```bash
# Add the marketplace
claude marketplace add KingsFish/tokenmeter

# Install the plugin
claude plugin install tokenmeter
```

### Manual Install

Alternatively, install from a local clone:

```bash
# Clone the repository
git clone https://github.com/KingsFish/tokenmeter.git

# Install the plugin
claude plugin install /path/to/tokenmeter
```

### Verify Installation

```bash
claude plugin list
```

## Commands

### `/usage` - CLI Usage Summary

Display a quick summary of your Claude Code token usage in the terminal.

```
/usage
```

**Output includes:**
- Total sessions, tokens, and turns
- Estimated cost
- Usage by project (top 5)
- Usage by model
- Recent sessions (last 5)

**Example output:**
```
=== Claude Code Usage Summary ===

Total: 42 sessions | 2.5M tokens (1.2M input + 1.3M output) | 156 turns

Estimated Cost: $45.50

By Project:
  myproject         15 sessions | 800K tokens | $12.50
  another-project   10 sessions | 500K tokens | $8.00
  ...

By Model:
  claude-sonnet-4-6  30 sessions | 1.8M tokens | $28.50
  claude-opus-4-6    12 sessions | 700K tokens | $17.00
  ...

Recent Sessions (last 5):
  2026-03-30 14:30  myproject (claude-sonnet-4-6)  45K tokens  3 turns  $0.75
  ...

Run /usage-dashboard for detailed charts and cost analysis.
```

---

### `/usage-config-price` - Price Configuration

Manage model prices for cost estimation.

```
/usage-config-price [command] [arguments]
```

**Commands:**

| Command | Description |
|---------|-------------|
| (no args), `--list` | Show current price configuration |
| `--unconfigured` | List models from transcripts without price config |
| `add <model> <input> <output>` | Add a new model price |
| `set <model> <input> <output>` | Modify an existing model price |
| `remove <model>` | Remove a model price |
| `default <input> <output>` | Set default price for unconfigured models |
| `reset` | Reset to plugin defaults |

**Arguments:**
- `model` - Model name (e.g., `claude-sonnet-4-6`, `glm-5`)
- `input` - Input price per million tokens (in USD)
- `output` - Output price per million tokens (in USD)

**Examples:**
```bash
# Show current configuration
/usage-config-price

# List configured models
/usage-config-price --list

# Show models needing configuration
/usage-config-price --unconfigured

# Add a new model price
/usage-config-price add glm-5 1.0 2.0

# Modify an existing model price
/usage-config-price set claude-sonnet-4-6 3.0 15.0

# Remove a model price
/usage-config-price remove old-model

# Set default price for unconfigured models
/usage-config-price default 3.0 15.0

# Reset to defaults
/usage-config-price reset
```

---

### `/usage-dashboard` - Web Dashboard

Start an interactive web dashboard for detailed usage analysis.

```
/usage-dashboard [port]
```

**Arguments:**
- `port` - Optional port number (default: 8765)

**Examples:**
```bash
# Start on default port 8765
/usage-dashboard

# Start on a custom port
/usage-dashboard 9000
```

The dashboard will open automatically in your browser. If it doesn't, manually navigate to `http://localhost:8765`.

## Price Configuration Guide

### How Prices Work

Cost estimation uses a two-tier pricing system:

1. **Model-specific prices**: Exact prices for specific models
2. **Default price**: Fallback price for models without explicit configuration

### Price Format

Prices are specified in **USD per million tokens**:

```json
{
  "model_prices": {
    "claude-opus-4-6": {
      "input_per_million": 15.0,
      "output_per_million": 75.0
    }
  },
  "default_price": {
    "input_per_million": 3.0,
    "output_per_million": 15.0
  }
}
```

### Configuration Locations

Prices are loaded from (in order of preference):

1. **User config**: `~/.claude/tokenmeter/prices.json`
2. **Plugin defaults**: `config/prices.json` in the plugin directory

### Adding New Models

When you use a model that isn't in the configuration, the cost estimation will use the default price. You'll see a warning in both the CLI output and the dashboard.

To add a new model:

1. Run `/usage-config-price --unconfigured` to see which models need pricing
2. Add the model with appropriate prices:
   ```bash
   /usage-config-price add model-name input_price output_price
   ```

### Current Default Prices

| Model | Input ($/M) | Output ($/M) |
|-------|-------------|--------------|
| claude-opus-4-6 | $15.00 | $75.00 |
| claude-sonnet-4-6 | $3.00 | $15.00 |
| claude-haiku-4-5 | $0.80 | $4.00 |
| (default) | $3.00 | $15.00 |

## Dashboard Features

### Summary Cards

- **Total Tokens**: Cumulative token usage across all sessions
- **Est. Cost**: Estimated cost based on configured prices
- **Sessions**: Total number of Claude Code sessions

### Charts

1. **Token Usage Over Time**
   - Daily, weekly, or monthly aggregation
   - Stacked input/output tokens
   - Hover for detailed values

2. **Usage by Project**
   - Doughnut chart showing distribution
   - Click to filter sessions

3. **Usage by Model**
   - Bar chart comparing models
   - Shows which models you use most

### Sessions Table

- Sortable columns (date, project, model, tokens, cost, turns)
- Click column headers to sort
- Visual indicators for unconfigured models

### Settings Page

Access via the gear icon in the header:
- Add/edit/remove model prices
- Set default price
- View unconfigured models
- Reset to defaults

## Troubleshooting

### "jq is required but not installed"

**Solution**: Install jq using your package manager:
```bash
# macOS
brew install jq

# Ubuntu/Debian
apt-get install jq

# RHEL/CentOS
yum install jq
```

### Dashboard doesn't open automatically

**Possible causes**:
- Browser is blocking pop-ups
- Terminal doesn't have permission to open browser

**Solution**: Manually open the URL shown in the output (e.g., `http://localhost:8765`)

### "Claude projects directory not found"

**Possible causes**:
- You haven't used Claude Code yet
- The projects directory was moved

**Solution**: The plugin will show empty statistics. Start a Claude Code session first to generate transcript files.

### "Permission denied" errors

**Possible causes**:
- Scripts don't have execute permission

**Solution**:
```bash
chmod +x /path/to/tokenmeter/scripts/*.sh
```

### Cost shows "(default)" next to it

**Cause**: The model doesn't have explicit pricing configured.

**Solution**: Run `/usage-config-price --unconfigured` to see which models need pricing, then add prices for them.

### Port already in use

**Cause**: Another process is using the default port (8765).

**Solution**: Specify a different port:
```bash
/usage-dashboard 9000
```

### Data seems incorrect or missing

**Possible causes**:
- Corrupted transcript files are skipped automatically
- Sessions without usage data are not counted

**Solution**: Check for warning messages in the output. The plugin gracefully handles parsing errors and continues with valid data.

## Data Source

This plugin reads transcript files from:
```
~/.claude/projects/*/*.jsonl
```

Each JSONL file contains session data with token usage information in assistant messages.

## License

MIT License