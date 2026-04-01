# Stack Research

**Project:** TokenMeter
**Focus:** Technology Stack for Claude Code Plugin Development
**Generated:** 2026-04-01

## Executive Summary

TokenMeter's current stack is well-suited for its purpose. For future enhancements (real-time tracking, performance optimization), we recommend incremental additions rather than architectural changes.

## Current Stack Assessment

| Component | Current | Assessment |
|-----------|---------|------------|
| Core parsing | Bash + jq | ✓ Good - lightweight, fast |
| HTTP server | Python stdlib | ✓ Good - no dependencies |
| Frontend | Vanilla JS + Chart.js | ✓ Good - no build needed |
| Config storage | JSON files | ✓ Good - simple, portable |

## Recommended Additions

### For Real-time Tracking (v1.2)

| Technology | Purpose | Confidence |
|------------|---------|------------|
| SSE (Server-Sent Events) | Push updates to dashboard | High |
| Claude Code hooks | Session end events | High |
| In-memory cache | Store recent sessions | Medium |

**Rationale:** SSE is simpler than WebSocket for one-way updates. Python's stdlib supports SSE via generators.

### For Performance (v1.3)

| Technology | Purpose | Confidence |
|------------|---------|------------|
| LocalStorage cache | Client-side caching | High |
| Server-side caching | Reduce re-parsing | High |
| Pagination | Large dataset handling | High |

**Avoid:**
- Webpack/bundlers - adds complexity without benefit
- npm dependencies - contradicts zero-install philosophy
- Database - overkill for local data

## Claude Code Plugin Stack

### Standard Plugin Structure

```
plugin/
├── .claude-plugin/
│   └── plugin.json       # Required: metadata
│   └── hooks.json        # Optional: event hooks
├── commands/             # Slash commands
│   └── *.md              # Command definitions
├── scripts/              # Executable scripts
└── config/               # Default config files
```

### Hook Types (2026)

| Hook | When it fires | Use case |
|------|---------------|----------|
| `SessionEnd` | After session closes | Log usage, cleanup |
| `Stop` | After each response | Real-time tracking |
| `PreToolUse` | Before tool execution | Validation, logging |
| `PostToolUse` | After tool execution | Auditing |

### Hook Configuration

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/hook.sh"
          }
        ]
      }
    ]
  }
}
```

## Version Recommendations

| Component | Recommended | Reason |
|-----------|-------------|--------|
| Python | 3.8+ | Type hints, f-strings |
| Bash | 4.0+ | Associative arrays |
| jq | 1.6+ | Current stable |
| Chart.js | 4.4+ | ESM support |

## Confidence Levels

- **High:** Technologies already proven in TokenMeter
- **Medium:** Standard patterns, needs implementation validation
- **Low:** Speculative, requires research

---
*Research completed: 2026-04-01*