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

# Start dashboard server in background
export PORT
"${TOKENMETER_DIR}/scripts/dashboard-server.py" &
SERVER_PID=$!

# Wait for server to start
sleep 1

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "Error: Failed to start dashboard server"
  exit 1
fi

# Open browser
URL="http://localhost:${PORT}"
echo "Dashboard running at: ${URL}"
if command -v open &>/dev/null; then
  open "$URL" 2>/dev/null
elif command -v xdg-open &>/dev/null; then
  xdg-open "$URL" 2>/dev/null
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Dashboard server running (PID: ${SERVER_PID})"
echo " Press Enter or type 'stop' to close the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for user input
read -r USER_INPUT

# Stop the server
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo "Dashboard server stopped."
`