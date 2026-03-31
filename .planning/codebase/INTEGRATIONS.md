# Integrations

**Project:** TokenMeter
**Generated:** 2026-03-31

## External Services

None. TokenMeter is a fully local application with no external service dependencies.

## Data Sources

### Claude Code Transcripts

| Source | Location | Format |
|--------|----------|--------|
| Session transcripts | `~/.claude/projects/*/*.jsonl` | JSONL |

**Transcript Structure:**
```json
{
  "type": "assistant",
  "sessionId": "...",
  "cwd": "/path/to/project",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "message": {
    "model": "claude-sonnet-4-6",
    "usage": {
      "input_tokens": 1000,
      "output_tokens": 500
    }
  }
}
```

## APIs Consumed

None. TokenMeter reads local files only.

## APIs Provided

TokenMeter's dashboard server provides a local REST API:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/usage` | GET | Get usage data with optional filters |
| `/api/prices` | GET | Get price configuration |
| `/api/prices` | POST | Update price configuration |
| `/api/health` | GET | Health check |

**Query Parameters for `/api/usage`:**
- `last` - Last N days (e.g., `7`, `30`)
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)
- `model` - Filter by model name
- `project` - Filter by project name (partial match)

## Authentication

None required. All endpoints are local and unauthenticated.

## Webhooks

None.

## Third-Party Libraries

| Library | Source | Purpose |
|---------|--------|---------|
| Chart.js | cdn.jsdelivr.net | Frontend charts |

**CDN URLs:**
- Primary: `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`
- Fallback: `https://unpkg.com/chart.js@4.4.1/dist/chart.umd.min.js`

## Claude Code Integration

TokenMeter integrates with Claude Code as a plugin:

| Integration Point | Location |
|-------------------|----------|
| Plugin commands | `commands/*.md` |
| Plugin metadata | `.claude-plugin/plugin.json` |
| Marketplace config | `.claude-plugin/marketplace.json` |

**Available Commands:**
- `/usage` - Display usage summary in CLI
- `/usage-dashboard` - Start web dashboard
- `/usage-config-price` - Manage model pricing