# Pitfalls Research

**Project:** TokenMeter
**Focus:** Common mistakes and how to avoid them
**Generated:** 2026-04-01

## Executive Summary

Key pitfalls fall into categories: data handling, performance, user experience, and plugin integration. Most can be avoided with defensive coding and incremental updates.

## Pitfall Categories

### 1. Data Handling Pitfalls

#### 1.1 Corrupted JSONL Files

**Risk:** Claude Code transcript files may become corrupted.

**Warning Signs:**
- jq parsing errors
- Missing session data
- Inconsistent token counts

**Prevention:**
```bash
# Always use error-tolerant parsing
jq -c 'select(.type == "assistant" and .message.usage != null)' file.jsonl 2>/dev/null || true
```

**Phase:** v1.1+ (already handled)

---

#### 1.2 Missing Price Configuration

**Risk:** New models may not have pricing, leading to incorrect cost estimates.

**Warning Signs:**
- Cost shows "(default)" suffix
- Warning card in dashboard

**Prevention:**
- Default price fallback (already implemented)
- Unconfigured model warnings (already implemented)
- Periodic price config updates

**Phase:** v1.1+ (already handled)

---

#### 1.3 Session ID Collisions

**Risk:** Different sessions might have same ID (unlikely but possible).

**Warning Signs:**
- Impossible token totals
- Sessions spanning days

**Prevention:**
- Use combination of sessionId + date as key
- Validate session duration

**Phase:** v1.2 (hooks)

---

### 2. Performance Pitfalls

#### 2.1 Full File Scan on Every Request

**Risk:** Scanning all JSONL files for every request is O(n) and slow.

**Warning Signs:**
- API response time > 2s
- Dashboard takes > 5s to load
- High disk I/O

**Prevention:**
- Implement caching layer
- Incremental updates via hooks
- Server-side caching

**Phase:** v1.2 (hooks), v1.3 (performance)

---

#### 2.2 Large Session History

**Risk:** Users with many sessions (>1000) will see slow dashboard.

**Warning Signs:**
- Dashboard load time increases over time
- Browser memory pressure

**Prevention:**
- Pagination for sessions table
- Lazy loading for charts
- Date range defaults (show last 30 days)

**Phase:** v1.3 (performance)

---

#### 2.3 Memory Leaks in Long-running Dashboard

**Risk:** Chart.js instances may not be properly cleaned up.

**Warning Signs:**
- Browser memory grows over time
- Dashboard slows after hours of use

**Prevention:**
```javascript
// Always destroy charts before recreating
if (tokensChart) {
    tokensChart.destroy();
}
tokensChart = new Chart(...);
```

**Phase:** v1.3 (UI)

---

### 3. User Experience Pitfalls

#### 3.1 Silent Failures

**Risk:** Errors occur but users don't notice.

**Warning Signs:**
- Data looks incomplete
- No error messages shown

**Prevention:**
- Show warnings for parsing errors
- Display unconfigured models prominently
- Log errors to console for debugging

**Phase:** v1.1+ (already handled)

---

#### 3.2 Confusing Cost Display

**Risk:** Users don't understand why costs are estimated.

**Warning Signs:**
- User questions about cost accuracy
- Unexpectedly high/low costs

**Prevention:**
- Show "(estimated)" label
- Display price source (configured vs default)
- Link to price configuration

**Phase:** v1.1+ (already handled)

---

#### 3.3 Filter State Confusion

**Risk:** Users don't realize filters are active.

**Warning Signs:**
- "Where's my data?"
- Missing sessions in results

**Prevention:**
- Show active filters prominently
- Clear filter indicators
- Easy reset button

**Phase:** v1.1+ (already handled)

---

### 4. Plugin Integration Pitfalls

#### 4.1 Hook Execution Failures

**Risk:** Hook script fails silently.

**Warning Signs:**
- No cache updates
- Dashboard shows stale data

**Prevention:**
- Log hook execution to file
- Fallback to full parse if cache is stale
- Test hooks thoroughly

**Phase:** v1.2 (hooks)

---

#### 4.2 Plugin Update Breaking Changes

**Risk:** Plugin updates break existing configuration.

**Warning Signs:**
- Config format changes
- Command syntax changes

**Prevention:**
- Version config files
- Migration scripts for breaking changes
- Backward compatibility

**Phase:** Ongoing

---

#### 4.3 Cross-platform Compatibility

**Risk:** Scripts work on macOS but not Linux.

**Warning Signs:**
- Date command syntax differences
- Path separator issues
- Permission errors

**Prevention:**
```bash
# Use portable date syntax with fallbacks
date -u -v-${DAYS}d +"%Y-%m-%d" 2>/dev/null || \
date -u -d "${DAYS} days ago" +"%Y-%m-%d" 2>/dev/null || \
date -u --date="${DAYS} days ago" +"%Y-%m-%d"
```

**Phase:** Ongoing

---

## Prevention Checklist

| Pitfall | Prevented | Phase |
|---------|-----------|-------|
| Corrupted JSONL | ✓ | v1.0 |
| Missing prices | ✓ | v1.0 |
| Full file scan | Planned | v1.2 |
| Large history | Planned | v1.3 |
| Memory leaks | Planned | v1.3 |
| Silent failures | ✓ | v1.0 |
| Confusing costs | ✓ | v1.0 |
| Filter confusion | ✓ | v1.0 |
| Hook failures | Planned | v1.2 |
| Update breaks | Planned | Ongoing |
| Cross-platform | Partial | Ongoing |

---
*Research completed: 2026-04-01*