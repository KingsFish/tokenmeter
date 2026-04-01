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
# Enable nullglob for zsh compatibility (no error on unmatched globs)
setopt nullglob 2>/dev/null || set -o nullglob 2>/dev/null

# Find the tokenmeter plugin directory based on this script's location
# First try fallback search (more reliable across execution contexts)
TOKENMETER_DIR=""
for candidate in \
  ~/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/ \
  ~/.local/share/claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/; do
  if [[ -d "${candidate%/}/scripts" ]]; then
    TOKENMETER_DIR="${candidate%/}"
    break
  fi
done

# Fallback to BASH_SOURCE if cache search failed
if [[ -z "$TOKENMETER_DIR" && -n "${BASH_SOURCE[0]}" ]]; then
  TOKENMETER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

if [[ -z "${TOKENMETER_DIR:-}" ]]; then
  echo "Error: Could not locate tokenmeter plugin directory"
  exit 1
fi

# Parse port from arguments if provided
PORT=8765
if [ -n "$ARGUMENTS" ]; then
  PORT=$(echo "$ARGUMENTS" | awk '{print $1}')
  if ! echo "$PORT" | grep -qE '^[0-9]+$'; then
    echo "Error: Invalid port number '$PORT'"
    echo "Usage: /usage-dashboard [port]"
    exit 1
  fi
fi

# Start dashboard using the original script (it handles browser opening)
export PORT
"${TOKENMETER_DIR}/scripts/start-dashboard.sh" &

# Give a brief message and exit - server runs in background
echo "Dashboard started at http://localhost:${PORT}"
echo "To stop: pkill -f dashboard-server.py"
`