<!-- GSD:project-start source:PROJECT.md -->
## Project

**TokenMeter**

TokenMeter is a Claude Code plugin that measures token usage with a CLI summary command and an interactive web dashboard. It parses Claude Code transcript files stored in `~/.claude/projects` and provides token usage tracking, cost estimation, and visualization capabilities.

**Core Value:** Help users monitor and understand their Claude Code token consumption and costs with accurate, real-time data.

### Constraints

- **Dependencies:** Requires `jq` and `python3` installed
- **Platform:** macOS and Linux fully supported, Windows requires WSL
- **No Build:** Must remain pure scripts without compilation
- **CDN Dependency:** Chart.js loaded from CDN (fallback available)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
| Language | Purpose | Version |
|----------|---------|---------|
| Bash | Core parsing logic, CLI commands | 3.2+ |
| Python | HTTP server for web dashboard | 3.8+ |
| JavaScript | Frontend dashboard application | ES6+ |
| HTML/CSS | Dashboard UI | HTML5, CSS3 |
## Runtime Environment
- **Shell:** Bash (POSIX-compatible)
- **Python:** Standard library only (no external dependencies)
- **Browser:** Modern browsers with ES6 support
## Dependencies
### System Dependencies
| Dependency | Purpose | Required |
|------------|---------|----------|
| `jq` | JSON processing in Bash scripts | Yes |
| `python3` | Dashboard HTTP server | Yes |
### Frontend Dependencies
| Dependency | Version | Purpose | Source |
|------------|---------|---------|--------|
| Chart.js | 4.4.1 | Data visualization charts | CDN |
## Configuration Files
| File | Purpose |
|------|---------|
| `config/prices.json` | Default model pricing configuration |
| `.claude-plugin/plugin.json` | Plugin metadata |
| `.claude-plugin/marketplace.json` | Marketplace registration |
## Build & Install
## Platform Support
| Platform | Support | Notes |
|----------|---------|-------|
| macOS | Full | Primary development platform |
| Linux | Full | Tested on Ubuntu/Debian |
| Windows | Partial | Requires WSL or Git Bash |
## Data Storage
| Data | Location | Format |
|------|----------|--------|
| Claude transcripts | `~/.claude/projects/*/*.jsonl` | JSONL |
| User price config | `~/.claude/tokenmeter/prices.json` | JSON |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
### Bash Scripts
#!/bin/bash
#
#
- Always use `set -euo pipefail`
- Use `[[ ]]` for tests, not `[ ]`
- Quote all variables: `"${var}"`
- Use `$(...)` for command substitution
- Check required commands early
### Python
#!/usr/bin/env python3
### JavaScript
### CSS
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
### Python
### JavaScript
## Documentation Comments
- Bash: Header comments with usage examples
- Python: Docstrings for modules, classes, and functions
- JavaScript: JSDoc comments for public functions
- CSS: Section comments for major components
## CLI Output Format
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```
```
## Pattern
- **CLI Path:** Command → Shell Script → jq → Output
- **Dashboard Path:** Browser → Python HTTP Server → Shell Script → jq → JSON Response
## Components
### 1. Command Layer (`commands/`)
- `usage.md` - `/usage` command
- `usage-dashboard.md` - `/usage-dashboard` command
- `usage-config-price.md` - `/usage-config-price` command
### 2. Scripts Layer (`scripts/`)
| Script | Purpose |
|--------|---------|
| `parse-usage.sh` | Parse transcript files, calculate statistics |
| `price-config.sh` | Manage model price configuration |
| `start-dashboard.sh` | Launch Python HTTP server |
### 3. Server Layer (`scripts/dashboard-server.py`)
- Serve static HTML/CSS/JS files
- Provide `/api/*` endpoints
- Bridge between HTTP and shell scripts
### 4. Frontend Layer (`dashboard/`)
| File | Purpose |
|------|---------|
| `index.html` | Main dashboard page |
| `app.js` | Dashboard logic and chart rendering |
| `style.css` | Styling with dark mode support |
| `settings.html` | Price configuration page |
| `settings.js` | Settings page logic |
## Data Flow
### CLI Usage Flow
```
```
### Dashboard Flow
```
```
## Abstractions
### Price Configuration
### Session Aggregation
## Entry Points
| Entry Point | Trigger | Handler |
|-------------|---------|---------|
| `/usage` | Claude Code command | `commands/usage.md` |
| `/usage-dashboard` | Claude Code command | `commands/usage-dashboard.md` |
| `/usage-config-price` | Claude Code command | `commands/usage-config-price.md` |
| `GET /api/usage` | HTTP request | `dashboard-server.py` |
| `GET /api/prices` | HTTP request | `dashboard-server.py` |
| `POST /api/prices` | HTTP request | `dashboard-server.py` |
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
