# TokenMeter Roadmap

## v1.1 - Enhanced Filtering

### 1. Date/Model/Session Filters

**Priority: High**

Add filtering capabilities to both CLI and Web Dashboard:

- **Date Range Filter**: Filter sessions by date range (last 7 days, last 30 days, custom range)
- **Model Filter**: Filter by specific model (e.g., only show claude-sonnet-4-6 sessions)
- **Session Filter**: Search/filter by session ID or project name

**CLI Updates:**
```bash
/usage --last 7d
/usage --model claude-sonnet-4-6
/usage --project my-project
/usage --from 2026-03-01 --to 2026-03-29
```

**Web Dashboard Updates:**
- Add filter bar above charts
- Date picker component
- Model dropdown selector
- Project search input
- Apply filters to all charts and tables

**Files to modify:**
- `scripts/parse-usage.sh` - Add filter parameters
- `commands/usage.md` - Add filter argument handling
- `dashboard/app.js` - Add filter UI and logic
- `dashboard/index.html` - Add filter components
- `dashboard/style.css` - Style filter components

---

## v1.2 - Real-time Tracking

### 2. Real-time Token Updates via Hooks

**Priority: High**

Monitor Claude Code session start/end events and update token stats in real-time.

**Implementation:**

Use Claude Code hooks to track sessions:

1. **SessionEnd Hook** - Fires when session ends
   - Parse current session's token usage from transcript
   - Append to usage data file
   - No need to re-parse all transcripts

2. **Stop Hook** - Fires after each response (optional)
   - Update running token count
   - Push to Dashboard via WebSocket (if open)

**Hook Configuration** (`.claude-plugin/hooks.json`):
```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/session-end-hook.sh"
          }
        ]
      }
    ]
  }
}
```

**Benefits:**
- Instant updates when Dashboard is open
- No need to re-parse all transcripts each time
- Lower latency for stats display

**Files to create/modify:**
- `.claude-plugin/hooks.json` - Hook configuration
- `scripts/session-end-hook.sh` - Hook script
- `scripts/append-usage.sh` - Append session data
- `dashboard/app.js` - Add WebSocket/SSE support for live updates

**Challenges:**
- Need to handle partial session data gracefully
- Dashboard must be running to receive live updates
- Fallback to full parse if hook data is missing

---

### 3. Settings Page Button Layout

**Priority: Low**

Move Save/Cancel buttons to top-right of Settings page for better UX.

**Current layout:**
```
[Header]
[Form content...]
[Save] [Cancel]  <- buttons at bottom
```

**New layout:**
```
[Header]                    [Cancel] [Save]
[Form content...]
```

**Implementation:**
- Move buttons to header section
- Use flexbox with `justify-content: space-between`
- Keep sticky positioning on header
- Add confirmation dialog on Cancel if there are unsaved changes

**Files to modify:**
- `dashboard/settings.html` - Restructure header
- `dashboard/settings.js` - Add unsaved changes tracking
- `dashboard/style.css` - Style top-right buttons

---

## v1.3 - UI Enhancement

### 4. Optimize Web UI with frontend-dev

**Priority: Medium**

Use `frontend-dev` skill to modernize and enhance the Web Dashboard:

**Visual Improvements:**
- Modern, polished design with premium aesthetics
- Smooth animations and transitions
- Better color scheme and typography
- Responsive design improvements
- Dark mode refinements

**UX Improvements:**
- Loading skeletons instead of "Loading..." text
- Smoother chart animations
- Better error states with retry options
- Toast notifications for actions
- Keyboard shortcuts

**Technical Improvements:**
- Optimize bundle size
- Add micro-interactions
- Improve accessibility (a11y)
- Add progressive loading for large datasets

**Reference:**
- Use `/frontend-dev` skill for implementation
- Follow modern web design patterns

---

## v1.4 - Easy Installation

### 5. Plugin Marketplace Publishing

**Priority: High**

Enable one-command installation without downloading source code:

```bash
claude plugin install tokenmeter
```

**How Claude Code Marketplace Works:**

Based on research, there are two approaches:

**Option A: Submit to Official Marketplace (Recommended)**

Submit PR to `anthropics/claude-plugins-official`:

1. Fork `anthropics/claude-plugins-official`
2. Create directory `external_plugins/tokenmeter/`
3. Add `.claude-plugin/plugin.json`:
   ```json
   {
     "name": "tokenmeter",
     "description": "Measure your Claude Code token usage with CLI stats and Web Dashboard",
     "author": { "name": "KingsFish" }
   }
   ```
4. Add `.mcp.json` (if needed for MCP servers)
5. Submit PR for review

After approval, users can install:
```bash
claude plugin install tokenmeter
```

**Option B: Create Custom Marketplace**

Host our own marketplace:

1. Create `marketplace.json` in repo root with plugin list
2. Users add marketplace once:
   ```bash
   claude marketplace add KingsFish/tokenmeter
   ```
3. Then install:
   ```bash
   claude plugin install tokenmeter
   ```

Reference: See `~/.claude/plugins/known_marketplaces.json` for marketplace structure.

**Tasks:**
- [x] Research Claude Code plugin marketplace requirements
- [ ] Create PR to `anthropics/claude-plugins-official` (Option A)
- [ ] Or create custom marketplace (Option B)
- [ ] Update README with one-line installation instructions
- [ ] Test installation on fresh Claude Code setup

---

### v1.5+
- Export data to CSV/JSON
- Per-session detail view with message breakdown
- Usage alerts/notifications
- Team/organization usage aggregation
- Multiple Claude Code installations support