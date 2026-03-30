---
allowed-tools: Bash
description: Display Claude Code token usage summary
argument-hint: "[--last <days>] [--model <name>] [--project <name>] [--from <date>] [--to <date>]"
---

## Context

Arguments: `$ARGUMENTS`

Usage summary data:

!`
# Find the parse-usage.sh script
SCRIPT=""
for p in ~/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/scripts/parse-usage.sh; do
  if [ -x "$p" ]; then
    SCRIPT="$p"
    break
  fi
done

if [ -n "$SCRIPT" ]; then
  # Build command with arguments
  CMD="$SCRIPT --summary"

  # Parse arguments if provided
  if [ -n "$ARGUMENTS" ]; then
    # Parse each argument
    while IFS= read -r arg; do
      # Handle --last
      if [[ "$arg" == --last* ]]; then
        days=$(echo "$arg" | sed 's/--last[= ]*//')
        CMD="$CMD --last $days"
      fi
      # Handle --model
      if [[ "$arg" == --model* ]]; then
        model=$(echo "$arg" | sed 's/--model[= ]*//')
        CMD="$CMD --model $model"
      fi
      # Handle --project
      if [[ "$arg" == --project* ]]; then
        project=$(echo "$arg" | sed 's/--project[= ]*//')
        CMD="$CMD --project $project"
      fi
      # Handle --from
      if [[ "$arg" == --from* ]]; then
        from=$(echo "$arg" | sed 's/--from[= ]*//')
        CMD="$CMD --from $from"
      fi
      # Handle --to
      if [[ "$arg" == --to* ]]; then
        to=$(echo "$arg" | sed 's/--to[= ]*//')
        CMD="$CMD --to $to"
      fi
    done <<< "$(echo "$ARGUMENTS" | tr ' ' '\n' | grep '^--')"
  fi

  # Execute the command
  eval "$CMD"
else
  echo "Error: tokenmeter plugin not found"
fi
`

## Your task

Display the usage summary data above to the user.

## Usage Examples

```bash
/usage                      # All sessions
/usage --last 7             # Last 7 days
/usage --last 30            # Last 30 days
/usage --model claude-sonnet-4-6  # Filter by model
/usage --project myproject  # Filter by project name
/usage --from 2026-03-01 --to 2026-03-29  # Custom date range
/usage --last 7 --model claude-sonnet-4-6  # Combined filters
```