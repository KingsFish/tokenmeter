---
description: Display Claude Code token usage summary
allowed-tools: [Bash]
---

## Token Usage Summary

!`
# Find the tokenmeter plugin directory using find (works in any shell)
TOKENMETER_DIR=$(find ~/.claude/plugins/cache -type d -name "scripts" -path "*tokenmeter*" 2>/dev/null | head -1 | xargs dirname)

if [[ -z "$TOKENMETER_DIR" ]]; then
  echo "Error: Could not locate tokenmeter plugin"
  exit 1
fi

"${TOKENMETER_DIR}/scripts/parse-usage.sh" --summary 2>/dev/null
`