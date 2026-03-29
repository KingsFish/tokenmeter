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

## v1.2 - UI Enhancement

### 2. Optimize Web UI with frontend-dev

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

## Future Considerations

### v1.3+
- Export data to CSV/JSON
- Per-session detail view with message breakdown
- Usage alerts/notifications
- Team/organization usage aggregation
- Multiple Claude Code installations support