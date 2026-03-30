---
allowed-tools: Bash
description: Display Claude Code token usage summary
---

## Context

Usage summary data:

!`
SCRIPT=""
for p in ~/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/scripts/parse-usage.sh; do
  if [ -x "$p" ]; then
    SCRIPT="$p"
    break
  fi
done
if [ -n "$SCRIPT" ]; then
  "$SCRIPT" --summary
else
  echo "Error: tokenmeter plugin not found"
fi
`

## Your task

Display the usage summary data above to the user.