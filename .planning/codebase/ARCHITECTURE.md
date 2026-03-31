# Architecture

**Project:** TokenMeter
**Generated:** 2026-03-31

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code                              │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  /usage     │  │/usage-dashboard │  │/usage-config-   │  │
│  │  command    │  │    command      │  │   price         │  │
│  └──────┬──────┘  └────────┬────────┘  └────────┬────────┘  │
└─────────┼──────────────────┼────────────────────┼───────────┘
          │                  │                    │
          ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Scripts Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │parse-usage.sh   │  │start-dashboard  │  │price-config │  │
│  │                 │  │    .sh          │  │   .sh       │  │
│  └────────┬────────┘  └────────┬────────┘  └─────────────┘  │
└──────────┼────────────────────┼─────────────────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌────────────────────────────────────────┐
│   jq + Bash      │  │         Python HTTP Server             │
│   (JSON parse)   │  │         (dashboard-server.py)          │
└────────┬─────────┘  └───────────────────┬────────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    Data Layer                                 │
│  ┌─────────────────────┐  ┌───────────────────────────────┐  │
│  │ ~/.claude/projects/ │  │ ~/.claude/tokenmeter/         │  │
│  │    *.jsonl          │  │    prices.json (user config)  │  │
│  └─────────────────────┘  └───────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Pattern

**Architecture Pattern:** Pipeline with Web Interface

- **CLI Path:** Command → Shell Script → jq → Output
- **Dashboard Path:** Browser → Python HTTP Server → Shell Script → jq → JSON Response

## Components

### 1. Command Layer (`commands/`)

Markdown files with embedded Bash that Claude Code executes.

**Purpose:** Define CLI commands that integrate with Claude Code.

**Files:**
- `usage.md` - `/usage` command
- `usage-dashboard.md` - `/usage-dashboard` command
- `usage-config-price.md` - `/usage-config-price` command

### 2. Scripts Layer (`scripts/`)

Core business logic implemented in Bash.

**Files:**
| Script | Purpose |
|--------|---------|
| `parse-usage.sh` | Parse transcript files, calculate statistics |
| `price-config.sh` | Manage model price configuration |
| `start-dashboard.sh` | Launch Python HTTP server |

### 3. Server Layer (`scripts/dashboard-server.py`)

Python HTTP server providing REST API and static file serving.

**Responsibilities:**
- Serve static HTML/CSS/JS files
- Provide `/api/*` endpoints
- Bridge between HTTP and shell scripts

### 4. Frontend Layer (`dashboard/`)

Single-page web application for visualization.

**Files:**
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
User runs /usage
    → Claude Code executes usage.md
    → usage.md calls parse-usage.sh --summary
    → parse-usage.sh:
        1. Finds all *.jsonl files in ~/.claude/projects/
        2. Extracts usage data with jq
        3. Calculates costs using price config
        4. Outputs formatted summary
    → Claude displays result to user
```

### Dashboard Flow

```
User opens browser
    → start-dashboard.sh launches Python server
    → Browser loads index.html
    → app.js fetches /api/usage
    → Python server calls parse-usage.sh
    → parse-usage.sh outputs JSON
    → Python returns JSON to browser
    → Chart.js renders visualizations
```

## Abstractions

### Price Configuration

Two-tier pricing system:
1. **Model-specific prices:** Exact prices per model
2. **Default price:** Fallback for unconfigured models

### Session Aggregation

Sessions are identified by `sessionId` in transcripts. Multiple turns in a session are aggregated.

## Entry Points

| Entry Point | Trigger | Handler |
|-------------|---------|---------|
| `/usage` | Claude Code command | `commands/usage.md` |
| `/usage-dashboard` | Claude Code command | `commands/usage-dashboard.md` |
| `/usage-config-price` | Claude Code command | `commands/usage-config-price.md` |
| `GET /api/usage` | HTTP request | `dashboard-server.py` |
| `GET /api/prices` | HTTP request | `dashboard-server.py` |
| `POST /api/prices` | HTTP request | `dashboard-server.py` |