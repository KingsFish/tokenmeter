# Conventions

**Project:** TokenMeter
**Generated:** 2026-03-31

## Code Style

### Bash Scripts

**Style Guide:** Google Shell Style Guide (simplified)

```bash
# Shebang and header comment
#!/bin/bash
#
# script-name.sh - Brief description
#

# Strict mode
set -euo pipefail

# Variable naming: UPPER_SNAKE_CASE for globals, lower_snake_case for locals
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
local temp_file

# Command substitution with $() not backticks
result=$(command)

# Test brackets with spaces
if [[ -f "$file" ]]; then
    ...
fi

# Error messages to stderr
echo "Error: message" >&2
exit 1
```

**Key Patterns:**
- Always use `set -euo pipefail`
- Use `[[ ]]` for tests, not `[ ]`
- Quote all variables: `"${var}"`
- Use `$(...)` for command substitution
- Check required commands early

### Python

**Style Guide:** PEP 8

```python
#!/usr/bin/env python3
"""Module docstring."""

import os
from pathlib import Path

# Constants: UPPER_SNAKE_CASE
DEFAULT_PORT = 8765

# Classes: PascalCase
class DashboardHandler(SimpleHTTPRequestHandler):
    """Class docstring."""

    def method_name(self):
        """Method docstring."""
        pass

# Functions: snake_case
def run_server(port):
    """Function docstring."""
    pass
```

### JavaScript

**Style Guide:** Modern ES6+

```javascript
// Constants: UPPER_SNAKE_CASE or camelCase
const CHART_COLORS = { ... };
const filterState = { ... };

// Functions: camelCase
function formatTokens(num) {
    // ...
}

// Arrow functions for callbacks
sessions.forEach(session => {
    // ...
});

// Async/await for async operations
async function fetchData() {
    const response = await fetch(url);
    return response.json();
}

// JSDoc comments for public functions
/**
 * Format a number with K/M suffix
 * @param {number} num - The number to format
 * @returns {string} Formatted string
 */
function formatTokens(num) { ... }
```

### CSS

**Methodology:** BEM-like with CSS variables

```css
/* CSS Variables for theming */
:root {
    --accent-color: #4f46e5;
}

/* Block__Element--Modifier */
.filter-bar { }
.filter-bar__btn { }
.filter-bar__btn[data-active="true"] { }

/* Dark mode via media query */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #0f172a;
    }
}
```

## Naming Patterns

| Type | Convention | Example |
|------|------------|---------|
| Bash functions | snake_case | `format_price()` |
| Bash variables | UPPER_SNAKE_CASE | `PRICE_CONFIG_FILE` |
| Python functions | snake_case | `handle_usage_api()` |
| Python classes | PascalCase | `DashboardHandler` |
| JS functions | camelCase | `formatTokens()` |
| JS variables | camelCase | `filterState` |
| CSS classes | kebab-case with BEM | `filter-bar__btn` |
| Files | kebab-case | `parse-usage.sh` |

## Error Handling

### Bash

```bash
# Check required commands
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed." >&2
    exit 1
fi

# Check files exist
if [[ ! -f "$config_file" ]]; then
    echo "Error: Config file not found" >&2
    exit 1
fi

# Trap for cleanup
trap 'rm -f "${TEMP_FILE}"' EXIT
```

### Python

```python
try:
    result = subprocess.run(cmd, capture_output=True, timeout=30)
    if result.returncode != 0:
        self._send_error_response(f"Command failed: {result.stderr}")
        return
except subprocess.TimeoutExpired:
    self._send_error_response("Command timed out", status=504)
except Exception as e:
    self._send_error_response(f"Error: {e}")
```

### JavaScript

```javascript
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
    }
    return response.json();
} catch (error) {
    console.error('Failed:', error);
    showError(error.message);
}
```

## Documentation Comments

- Bash: Header comments with usage examples
- Python: Docstrings for modules, classes, and functions
- JavaScript: JSDoc comments for public functions
- CSS: Section comments for major components

## CLI Output Format

```bash
# Success messages: no prefix
"Added model 'claude-sonnet-4-6'"

# Warning messages: "Warning:" prefix
"Warning: 3 JSONL files had parsing errors"

# Error messages: "Error:" prefix to stderr
"Error: jq is required but not installed." >&2
```