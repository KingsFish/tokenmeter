---
description: Display Claude Code token usage summary
allowed-tools: [Bash]
---

## Token Usage Summary

!`
# Find the tokenmeter plugin directory
SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ -n "$SCRIPT_PATH" ]]; then
  TOKENMETER_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
else
  # Fallback: search common plugin cache locations
  for candidate in \
    ~/.claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/ \
    ~/.local/share/claude/plugins/cache/tokenmeter-marketplace/tokenmeter/*/; do
    if [[ -d "$candidate/scripts" ]]; then
      TOKENMETER_DIR="$candidate"
      break
    fi
  done
fi

"${TOKENMETER_DIR}/scripts/parse-usage.sh" 2>/dev/null | jq -r '
def format_tokens:
  if . >= 1000000 then
    ((. / 1000000) * 10 | floor / 10 | tostring) + "M"
  elif . >= 1000 then
    ((. / 1000) | floor | tostring) + "K"
  else
    . | tostring
  end;

def format_cost:
  if . == null then "N/A"
  elif . < 0.01 then "$0.00"
  else "$" + ((. * 100 | floor) / 100 | tostring)
  end;

# Header
"=== Claude Code Usage Summary ===",
"",
# Summary totals
"Total: \(.summary.total_sessions) sessions | \(.summary.total_tokens | format_tokens) tokens (\(.summary.total_input_tokens | format_tokens) input + \(.summary.total_output_tokens | format_tokens) output) | \(.summary.total_turns) turns",
"",
# Cost summary
"Estimated Cost: \(.summary.total_estimated_cost_usd | format_cost)",
# Check for models using default price
(if [.summary.by_model | to_entries[] | select(.value.cost_configured == false)] | length > 0 then
  "                (using default price for models without explicit config)"
else empty end),
"",
# By Project
"By Project:",
(.summary.by_project | to_entries | sort_by(-.value.sessions) | limit(5; .[]) |
  "  \(.key | .[0:20])  \(.value.sessions) sessions | \((.value.input + .value.output) | format_tokens) tokens | \(.value.estimated_cost_usd | format_cost)"
),
"",
# By Model
"By Model:",
(.summary.by_model | to_entries | sort_by(-.value.sessions) | .[] |
  "  \(.key)  \(.value.sessions) sessions | \((.value.input + .value.output) | format_tokens) tokens | \(if .value.cost_configured then .value.estimated_cost_usd | format_cost else .value.estimated_cost_usd | format_cost + " (default)" end)"
),
"",
# Recent Sessions
"Recent Sessions (last 5):",
(.sessions[-5:] | reverse | .[] |
  "  \(.start_time | split("T") | .[0]) \(.start_time | split("T")[1] | split(":")[0:2] | join(":"))  \(.project_name | .[0:15]) (\(.model))  \(.total_tokens | format_tokens) tokens  \(.turns) turns  \(.estimated_cost_usd | format_cost)"
),
"",
"Run /usage-dashboard for detailed charts and cost analysis."
'`