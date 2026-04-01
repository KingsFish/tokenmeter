---
description: Start the usage dashboard web interface
argument-hint: "[port|stop]"
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
- `stop` - Stop the running dashboard server

### Examples

```
/usage-dashboard           # Start on default port 8765
/usage-dashboard 9000      # Start on port 9000
/usage-dashboard stop      # Stop the running server
```

### Execute

!`
# Enable nullglob for zsh compatibility (no error on unmatched globs)
setopt nullglob 2>/dev/null || set -o nullglob 2>/dev/null

# Find the tokenmeter plugin directory based on this script's location
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

# PID file for tracking server
PID_FILE="/tmp/tokenmeter-dashboard.pid"
DEFAULT_PORT=8765

# Handle stop command
if [[ "$ARGUMENTS" == "stop" ]]; then
  if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID" 2>/dev/null
      rm -f "$PID_FILE"
      echo "Dashboard server stopped (PID: $PID)"
    else
      rm -f "$PID_FILE"
      echo "Dashboard server was not running"
    fi
  else
    echo "No dashboard server PID file found"
    echo "Try: pkill -f dashboard-server.py"
  fi
  exit 0
fi

# Check if already running
if [[ -f "$PID_FILE" ]]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "Dashboard already running at http://localhost:${DEFAULT_PORT} (PID: $PID)"
    echo "Use /usage-dashboard stop to stop it"
    exit 0
  else
    rm -f "$PID_FILE"
  fi
fi

# Parse port from arguments if provided
PORT="${DEFAULT_PORT}"
if [ -n "$ARGUMENTS" ]; then
  PORT=$(echo "$ARGUMENTS" | awk '{print $1}')
  if ! echo "$PORT" | grep -qE '^[0-9]+$'; then
    echo "Error: Invalid port number '$PORT'"
    echo "Usage: /usage-dashboard [port|stop]"
    exit 1
  fi
fi

# Start dashboard server
export PORT
"${TOKENMETER_DIR}/scripts/dashboard-server.py" &
SERVER_PID=$!
echo $SERVER_PID > "$PID_FILE"

# Wait briefly and check if server started
sleep 1
if ! kill -0 $SERVER_PID 2>/dev/null; then
  rm -f "$PID_FILE"
  echo "Error: Failed to start dashboard server"
  exit 1
fi

echo "Dashboard started at http://localhost:${PORT}"
echo "To stop: /usage-dashboard stop"
`