---
description: Start the usage dashboard web interface
argument-hint: "[port]"
allowed-tools: [Bash]
---

## Usage Dashboard

Arguments: `$ARGUMENTS`

Starts a local web server to display interactive usage statistics and charts.

### Usage

The dashboard will open automatically in your browser at http://localhost:8765

If it doesn't open, you can access it manually at the URL shown in the output.

**Arguments:**
- `port` - Optional port number (default: 8765)

### Examples

```
/usage-dashboard           # Start on default port 8765
/usage-dashboard 9000      # Start on port 9000
```

### Execute

!`
# Find the tokenmeter plugin directory based on this script's location
# The skill file is at <plugin-dir>/commands/usage-dashboard.md
# Scripts are at <plugin-dir>/scripts/
SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ -z "$SCRIPT_PATH" ]]; then
  # Fallback: try to find tokenmeter in common plugin locations
  for candidate in ~/.claude/plugins/tokenmeter ~/.local/share/claude/plugins/tokenmeter; do
    if [[ -d "$candidate/scripts" ]]; then
      TOKENMETER_DIR="$candidate"
      break
    fi
  done
else
  # Derive from script path - go up two levels from commands/ to plugin root
  TOKENMETER_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
fi

if [[ -z "${TOKENMETER_DIR:-}" ]]; then
  echo "Error: Could not locate tokenmeter plugin directory"
  exit 1
fi

# Parse port from arguments if provided
if [ -n "$ARGUMENTS" ]; then
  # Extract first argument as port number
  PORT=$(echo "$ARGUMENTS" | awk '{print $1}')
  # Validate it's a number
  if echo "$PORT" | grep -qE '^[0-9]+$'; then
    export PORT
  else
    echo "Error: Invalid port number '$PORT'"
    echo "Usage: /usage-dashboard [port]"
    exit 1
  fi
fi

# Start the dashboard using absolute path
exec "${TOKENMETER_DIR}/scripts/start-dashboard.sh"
`