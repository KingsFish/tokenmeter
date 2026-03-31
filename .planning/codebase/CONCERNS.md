# Concerns

**Project:** TokenMeter
**Generated:** 2026-03-31

## Technical Debt

### 1. No Test Coverage

**Issue:** No automated tests exist for any component.

**Impact:**
- Changes may introduce regressions undetected
- Refactoring is risky
- Bug fixes may not stay fixed

**Resolution:** Add unit tests for critical paths:
- `parse-usage.sh` JSON parsing
- Cost calculation logic
- API endpoints

**Priority:** High

---

### 2. Duplicate Price Config Logic

**Issue:** Price configuration logic exists in both:
- `scripts/price-config.sh` (CLI)
- `dashboard/settings.js` (frontend)
- `scripts/parse-usage.sh` (cost calculation)

**Impact:**
- Logic duplication
- Risk of inconsistency between CLI and dashboard

**Resolution:** Centralize price logic in API, make both CLI and dashboard use API.

**Priority:** Medium

---

### 3. jq Heavy Processing

**Issue:** `parse-usage.sh` relies heavily on complex jq expressions for data processing.

**Impact:**
- Hard to debug
- Performance may degrade with large datasets
- Limited error handling

**Resolution:** Consider Python for data processing, or add caching layer.

**Priority:** Medium

---

## Known Issues

### 1. Model Detection Fallback

**Location:** `scripts/parse-usage.sh:259-265`

```bash
model: (.entries | group_by(.model) | sort_by(-length) | .[0][0].model),
```

**Issue:** Uses "most common model" for sessions with multiple models. May be inaccurate for sessions that switch models.

**Status:** Documented behavior, not a bug.

---

### 2. Date Handling Platform Differences

**Location:** `scripts/parse-usage.sh:170`

```bash
FROM_DATE=$(date -u -v-${LAST_DAYS}d +"%Y-%m-%d" 2>/dev/null || \
            date -u -d "${LAST_DAYS} days ago" +"%Y-%m-%d" 2>/dev/null || \
            date -u --date="${LAST_DAYS} days ago" +"%Y-%m-%d")
```

**Issue:** Different date command syntax on macOS vs Linux.

**Status:** Handled with fallbacks.

---

### 3. Corrupted JSONL Handling

**Location:** `scripts/parse-usage.sh:160-165`

**Issue:** Corrupted JSONL files are skipped silently with just a warning.

**Impact:** Users may not realize data is missing.

**Resolution:** Consider exposing corruption count in output.

**Priority:** Low

---

## Security Considerations

### 1. Local Server No Authentication

**Issue:** Dashboard server has no authentication.

**Mitigation:** Server only binds to localhost, not externally accessible.

**Risk:** Low (local only)

---

### 2. File Path Injection

**Location:** `scripts/parse-usage.sh`

**Issue:** User-supplied project filter could potentially be used maliciously.

**Mitigation:** Input is only used for filtering, not executed.

**Risk:** Low

---

## Performance Concerns

### 1. Full Transcript Scan Every Request

**Issue:** Every `/api/usage` request scans all JSONL files in `~/.claude/projects/`.

**Impact:**
- Slower response with many sessions
- Repeated I/O for same data

**Resolution:** Implement caching:
- Cache parsed results
- Incremental updates
- Background refresh

**Priority:** High for roadmap (v1.2 hooks)

---

### 2. Chart.js Loading from CDN

**Issue:** Chart.js loaded from CDN may fail if network unavailable.

**Mitigation:** Fallback CDN URL provided.

**Resolution:** Consider bundling Chart.js locally for offline support.

**Priority:** Low

---

## Fragile Areas

### 1. Transcript Format Dependency

**Issue:** Parsing depends on Claude Code's transcript format.

**Risk:** Changes to Claude Code may break parsing.

**Mitigation:** Parse defensively, skip unrecognized formats.

---

### 2. jq Requirement

**Issue:** Plugin requires `jq` to be installed.

**Risk:** Users without `jq` cannot use plugin.

**Mitigation:** Clear error message with installation instructions.

---

## Outdated Dependencies

None - project uses only standard library and CDN-hosted Chart.js.

---

## Suggested Improvements (from ROADMAP.md)

| Issue | Priority | Phase |
|-------|----------|-------|
| Add filtering capabilities | High | v1.1 |
| Real-time tracking via hooks | High | v1.2 |
| UI enhancements | Medium | v1.3 |
| Performance optimization | Medium | v1.3 |
| GitHub repository creation | High | v1.4 |