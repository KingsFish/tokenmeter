# Architecture Research

**Project:** TokenMeter
**Focus:** Architecture patterns for real-time tracking
**Generated:** 2026-04-01

## Current Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌────────────────┐
│   Claude    │     │   Dashboard     │     │   JSONL        │
│   Code      │────▶│   Server        │────▶│   Files        │
│   Commands  │     │   (Python)      │     │   (Data)       │
└─────────────┘     └─────────────────┘     └────────────────┘
                            │
                            ▼
                     ┌─────────────────┐
                     │   Browser       │
                     │   (Dashboard)   │
                     └─────────────────┘
```

**Flow:** Request/Response (polling)

## Recommended Architecture (Real-time)

```
┌─────────────┐     ┌─────────────────┐     ┌────────────────┐
│   Claude    │     │   Dashboard     │     │   JSONL        │
│   Code      │────▶│   Server        │────▶│   Files        │
│   Commands  │     │   (Python)      │     │   (Data)       │
└──────┬──────┘     └────────┬────────┘     └────────────────┘
       │                     │
       │ Hooks               │ SSE
       ▼                     ▼
┌─────────────┐     ┌─────────────────┐
│   Session   │     │   Browser       │
│   End Hook  │────▶│   (Dashboard)   │
└─────────────┘     └─────────────────┘
```

**Flow:** Event-driven + SSE for live updates

## Component Design

### 1. Hook System

**Purpose:** Capture session events in real-time

```bash
#!/bin/bash
# scripts/session-end-hook.sh
# Called by Claude Code when session ends

# Read current session transcript
# Extract token usage
# Append to cache file
# Signal server (via file or socket)
```

**Configuration:**
```json
{
  "hooks": {
    "SessionEnd": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "${CLAUDE_PLUGIN_ROOT}/scripts/session-end-hook.sh"
      }]
    }]
  }
}
```

### 2. Cache Layer

**Purpose:** Store recent sessions without re-parsing

```
~/.claude/tokenmeter/
├── prices.json          # Price config
├── cache.json           # Recent sessions (last 100)
└── sessions.jsonl       # All sessions (append-only)
```

**Cache Structure:**
```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "sessions": [
    {
      "session_id": "abc123",
      "project": "tokenmeter",
      "model": "claude-sonnet-4-6",
      "input_tokens": 1000,
      "output_tokens": 500,
      "cost": 0.045,
      "timestamp": "2026-04-01T11:30:00Z"
    }
  ]
}
```

### 3. SSE Endpoint

**Purpose:** Push updates to connected browsers

```python
# Add to dashboard-server.py

def do_GET(self):
    if self.path == "/api/events":
        self._handle_sse()
    # ...

def _handle_sse(self):
    self.send_response(200)
    self.send_header("Content-Type", "text/event-stream")
    self.send_header("Cache-Control", "no-cache")
    self.send_header("Connection", "keep-alive")
    self.end_headers()

    # Send updates as they occur
    while True:
        # Check for new data
        # Send event
        # self.wfile.write(b"data: {...}\n\n")
```

### 4. Frontend Connection

```javascript
// dashboard/app.js
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDashboard(data);
};

eventSource.onerror = () => {
    // Fallback to polling
    setTimeout(() => initDashboard(), 5000);
};
```

## Data Flow

### Current (Polling)

```
Browser requests /api/usage
    → Server runs parse-usage.sh
    → parse-usage.sh scans all JSONL files
    → Returns JSON
    → Browser renders
```

**Issue:** O(n) file scans on every request

### Recommended (Cached + SSE)

```
Session ends
    → Hook appends to cache
    → Server detects change
    → SSE pushes to browser
    → Browser updates incrementally

Browser requests /api/usage
    → Server reads cache
    → Returns JSON
    → Browser renders
```

**Benefit:** O(1) for most requests

## Build Order

| Phase | Component | Dependencies |
|-------|-----------|--------------|
| 1 | Hook configuration | None |
| 2 | Session-end hook script | Phase 1 |
| 3 | Cache file format | None |
| 4 | Cache update logic | Phase 2, 3 |
| 5 | SSE endpoint | Phase 4 |
| 6 | Frontend SSE client | Phase 5 |

## Performance Targets

| Metric | Current | Target |
|--------|---------|--------|
| API response time | ~2-5s | <500ms |
| Dashboard load | ~3-8s | <1.5s |
| Memory usage | Low | Low |
| Disk I/O | High | Low (cached) |

---
*Research completed: 2026-04-01*