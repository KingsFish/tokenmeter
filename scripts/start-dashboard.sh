#!/bin/bash
#
# start-dashboard.sh - Start the usage-tracker dashboard server
#
# Usage:
#   ./start-dashboard.sh [port]
#
# Environment variables:
#   PORT - Server port (default: 8765)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Port configuration
PORT="${PORT:-8765}"
if [[ $# -gt 0 ]]; then
    PORT="$1"
fi

# Export for Python script to use
export PORT

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not installed." >&2
    echo "" >&2
    echo "Install Python 3:" >&2
    echo "  macOS:   brew install python3" >&2
    echo "  Linux:   apt-get install python3 or yum install python3" >&2
    exit 1
fi

# Check if parse-usage.sh exists
if [[ ! -x "${SCRIPT_DIR}/parse-usage.sh" ]]; then
    echo "Error: parse-usage.sh not found or not executable." >&2
    exit 1
fi

# Check if jq is available (required by parse-usage.sh)
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed." >&2
    echo "" >&2
    echo "Install jq:" >&2
    echo "  macOS:   brew install jq" >&2
    echo "  Linux:   apt-get install jq or yum install jq" >&2
    exit 1
fi

# Ensure dashboard directory exists
if [[ ! -d "${PROJECT_ROOT}/dashboard" ]]; then
    echo "Warning: dashboard directory not found. Creating empty directory." >&2
    mkdir -p "${PROJECT_ROOT}/dashboard"
fi

# Start the server
echo "Starting usage-tracker dashboard on port ${PORT}..."
exec python3 "${SCRIPT_DIR}/dashboard-server.py"