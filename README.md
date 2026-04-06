# TokenMeter

[中文版](README_CN.md)

A Claude Code plugin that measures token usage with a CLI summary command and an interactive web dashboard.

![Dashboard Preview](dashboard-screenshot.jpg)

## Introduction

TokenMeter helps you monitor Claude Code token consumption and estimate costs. It parses transcript files stored in `~/.claude/projects` and provides:

- **CLI Summary**: Quick terminal overview of usage statistics
- **Web Dashboard**: Interactive charts and detailed session history
- **Cost Estimation**: Estimated costs based on configurable model prices
- **i18n Support**: Chinese and English language support

## Installation

### Prerequisites

- **jq**: Required for JSON processing
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`
- **Python 3**: Required for the web dashboard (usually pre-installed)

### Quick Install

```bash
# Add marketplace
claude marketplace add KingsFish/tokenmeter

# Install plugin
claude plugin install tokenmeter
```

### Manual Install

```bash
git clone https://github.com/KingsFish/tokenmeter.git
claude plugin install /path/to/tokenmeter
```

## Commands

### `/usage` - CLI Usage Summary

Display a quick summary of your Claude Code token usage in the terminal.

**Output includes:**
- Total sessions, tokens, and turns
- Estimated cost
- Usage by project (top 5)
- Usage by model
- Recent sessions (last 5)

### `/usage-dashboard` - Web Dashboard

Start an interactive web dashboard for detailed usage analysis.

```bash
/usage-dashboard [port]  # Default port: 8765
```

**Features:**
- Token usage over time chart
- Usage breakdown by project and model
- Session history table with filtering
- Language toggle (Chinese/English)

### `/usage-config-price` - Price Configuration

Manage model prices for cost estimation.

```bash
/usage-config-price add <model> <input> <output>  # Add model price
/usage-config-price set <model> <input> <output>  # Modify price
/usage-config-price remove <model>                 # Remove price
/usage-config-price --list                         # Show current config
```

Prices are in USD per million tokens.

## License

MIT License