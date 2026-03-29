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

# Start the dashboard
./scripts/start-dashboard.sh
`