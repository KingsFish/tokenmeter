# Roadmap

**Project:** TokenMeter
**Generated:** 2026-04-01
**Total Phases:** 5

---

## Phase 1: Plugin Marketplace Publishing

**Goal:** Make TokenMeter installable via `claude plugin install tokenmeter`

**Requirements:** MKT-01, MKT-02, MKT-03, MKT-04

**Success Criteria:**
1. User can run `claude plugin install tokenmeter` successfully
2. All three commands (`/usage`, `/usage-dashboard`, `/usage-config-price`) work after install
3. README documentation covers installation, usage, and troubleshooting
4. Fresh installation tested on clean Claude Code setup

**Key Tasks:**
- Create GitHub repository (KingsFish/tokenmeter)
- Push code to main branch
- Test installation via marketplace
- Update README with marketplace instructions

**Estimated Plans:** 2

---

## Phase 2: Real-time Tracking via Hooks

**Goal:** Enable real-time token usage updates without manual refresh

**Requirements:** REAL-01, REAL-02, REAL-03, REAL-04, REAL-05

**Success Criteria:**
1. SessionEnd hook captures token usage automatically
2. Dashboard shows new sessions within 5 seconds of session end
3. Cache persists between server restarts
4. Graceful fallback when cache is unavailable

**Key Tasks:**
- Create `.claude-plugin/hooks.json` configuration
- Implement `scripts/session-end-hook.sh`
- Add cache layer (`~/.claude/tokenmeter/cache.json`)
- Add SSE endpoint to `dashboard-server.py`
- Update frontend to connect to SSE

**Dependencies:** None

**Estimated Plans:** 4

---

## Phase 3: Performance Optimization

**Goal:** Ensure dashboard remains fast even with large usage history

**Requirements:** PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06

**Success Criteria:**
1. API responds in under 500ms for users with 1000+ sessions
2. Dashboard loads in under 1.5 seconds
3. Pagination works correctly for sessions table
4. No memory growth during extended dashboard use

**Key Tasks:**
- Implement server-side caching
- Add pagination to sessions API
- Add LocalStorage cache for recent data
- Implement lazy loading for charts
- Fix memory leaks in Chart.js cleanup

**Dependencies:** Phase 2 (cache layer)

**Estimated Plans:** 4

---

## Phase 4: Data Export & Session Details

**Goal:** Allow users to export and analyze their usage data

**Requirements:** EXPR-01, EXPR-02, EXPR-03, EXPR-04

**Success Criteria:**
1. User can download CSV with all sessions
2. User can download JSON with full session details
3. Export respects date/model/project filters
4. Per-session view shows individual message tokens

**Key Tasks:**
- Add `/api/export/csv` endpoint
- Add `/api/export/json` endpoint
- Add export buttons to dashboard
- Create session detail modal/page

**Dependencies:** Phase 3 (performance for large exports)

**Estimated Plans:** 3

---

## Phase 5: Usage Alerts & Budget Tracking

**Goal:** Proactively notify users about budget thresholds

**Requirements:** ALRT-01, ALRT-02, ALRT-03, ALRT-04, ALRT-05

**Success Criteria:**
1. User can set daily and monthly budgets in settings
2. Dashboard shows progress toward budget
3. Alert appears when 80% threshold reached
4. Alert appears when budget exceeded

**Key Tasks:**
- Add budget settings to configuration
- Create budget progress component
- Implement threshold checking logic
- Add alert notifications to dashboard

**Dependencies:** Phase 2 (real-time for live alerts)

**Estimated Plans:** 3

---

## Phase Dependencies

```
Phase 1 (Marketplace)
    │
    ▼
Phase 2 (Real-time)
    │
    ├─────────────┐
    ▼             ▼
Phase 3      Phase 5
(Performance) (Alerts)
    │
    ▼
Phase 4 (Export)
```

---

## Summary

| Phase | Goal | Requirements | Plans |
|-------|------|--------------|-------|
| 1 | Marketplace Publishing | 4 | 2 |
| 2 | Real-time Tracking | 5 | 4 |
| 3 | Performance Optimization | 6 | 4 |
| 4 | Data Export | 4 | 3 |
| 5 | Usage Alerts | 5 | 3 |

**Total Requirements:** 24
**Total Phases:** 5
**Estimated Total Plans:** 16

---
*Roadmap created: 2026-04-01*