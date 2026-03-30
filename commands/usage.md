---
description: Display Claude Code token usage summary
allowed-tools: [Bash]
---

## Token Usage Summary

!`
# Try multiple known plugin installation paths
for path in \
  "$HOME/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/0.0.1" \
  "$HOME/.local/share/claude/plugins/cache/tokenmeter-marketplace/tokenmeter/0.0.1" \
  "$HOME/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*"; do
  if [ -d "$path/scripts" ]; then
    SCRIPT="$path/scripts/parse-usage.sh"
    if [ -x "$SCRIPT" ]; then
      "$SCRIPT" --summary
      exit 0
    fi
  fi
done

echo "Error: tokenmeter plugin not found"
exit 1
`