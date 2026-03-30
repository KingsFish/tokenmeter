---
description: Display Claude Code token usage summary
allowed-tools: [Bash]
---

## Context

Usage summary data:

!`
# Try multiple known plugin installation paths
for path in \
  "$HOME/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/0.0.1" \
  "$HOME/.local/share/claude/plugins/cache/tokenmeter-marketplace/tokenmeter/0.0.1"; do
  if [ -d "$path/scripts" ]; then
    SCRIPT="$path/scripts/parse-usage.sh"
    if [ -x "$SCRIPT" ]; then
      "$SCRIPT" --summary
      exit 0
    fi
  fi
done
echo "Error: tokenmeter plugin not found"
`

## Your task

Display the usage summary data above to the user in a clear, formatted way. Do not add any additional commentary or suggestions.