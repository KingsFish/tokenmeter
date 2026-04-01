# Requirements: TokenMeter

**Defined:** 2026-04-01
**Core Value:** Help users monitor and understand their Claude Code token consumption and costs with accurate, real-time data.

## v1 Requirements

### Marketplace Publishing (Phase 1)

- [ ] **MKT-01**: Plugin is available via `claude plugin install tokenmeter`
- [ ] **MKT-02**: GitHub repository exists at KingsFish/tokenmeter
- [ ] **MKT-03**: Installation tested on fresh Claude Code setup
- [ ] **MKT-04**: README documentation is complete and accurate

### Real-time Tracking (Phase 2)

- [ ] **REAL-01**: Claude Code SessionEnd hook captures token usage
- [ ] **REAL-02**: Cache layer stores recent sessions without re-parsing
- [ ] **REAL-03**: Dashboard updates via SSE when new sessions complete
- [ ] **REAL-04**: Fallback to full parse if cache is stale or missing
- [ ] **REAL-05**: Hook execution errors are logged and handled gracefully

### Performance Optimization (Phase 3)

- [ ] **PERF-01**: API response time under 500ms for typical usage
- [ ] **PERF-02**: Dashboard initial load under 1.5 seconds
- [ ] **PERF-03**: Sessions table supports pagination (20 per page)
- [ ] **PERF-04**: Chart data lazy-loads on demand
- [ ] **PERF-05**: Memory usage remains stable during extended use
- [ ] **PERF-06**: LocalStorage caches recent data (5-minute TTL)

### Data Export (Phase 4)

- [ ] **EXPR-01**: User can export sessions to CSV format
- [ ] **EXPR-02**: User can export sessions to JSON format
- [ ] **EXPR-03**: Export respects current filter settings
- [ ] **EXPR-04**: Per-session detail view shows message breakdown

### Usage Alerts (Phase 5)

- [ ] **ALRT-01**: User can set daily token budget
- [ ] **ALRT-02**: User can set monthly cost budget
- [ ] **ALRT-03**: Alert triggers when 80% of budget is reached
- [ ] **ALRT-04**: Alert triggers when budget is exceeded
- [ ] **ALRT-05**: Alerts display in dashboard and CLI

## v2 Requirements

Deferred to future release.

### Team Features

- **TEAM-01**: Multi-user usage aggregation
- **TEAM-02**: Team budget management
- **TEAM-03**: Usage comparison across team members

### Advanced Analytics

- **ANLY-01**: Usage trend predictions
- **ANLY-02**: Price optimization suggestions
- **ANLY-03**: Cost by feature/operation breakdown

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloud sync | Local-first philosophy, no server infrastructure |
| User accounts | Local plugin, no authentication needed |
| Mobile native app | Web dashboard works on mobile browsers |
| Real-time chat | Not related to usage tracking |
| Third-party integrations | Adds complexity, not core value |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MKT-01 | Phase 1 | Pending |
| MKT-02 | Phase 1 | Pending |
| MKT-03 | Phase 1 | Pending |
| MKT-04 | Phase 1 | Pending |
| REAL-01 | Phase 2 | Pending |
| REAL-02 | Phase 2 | Pending |
| REAL-03 | Phase 2 | Pending |
| REAL-04 | Phase 2 | Pending |
| REAL-05 | Phase 2 | Pending |
| PERF-01 | Phase 3 | Pending |
| PERF-02 | Phase 3 | Pending |
| PERF-03 | Phase 3 | Pending |
| PERF-04 | Phase 3 | Pending |
| PERF-05 | Phase 3 | Pending |
| PERF-06 | Phase 3 | Pending |
| EXPR-01 | Phase 4 | Pending |
| EXPR-02 | Phase 4 | Pending |
| EXPR-03 | Phase 4 | Pending |
| EXPR-04 | Phase 4 | Pending |
| ALRT-01 | Phase 5 | Pending |
| ALRT-02 | Phase 5 | Pending |
| ALRT-03 | Phase 5 | Pending |
| ALRT-04 | Phase 5 | Pending |
| ALRT-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after initial definition*