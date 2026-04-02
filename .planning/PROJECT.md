# TokenMeter

## What This Is

TokenMeter is a Claude Code plugin that measures token usage with a CLI summary command and an interactive web dashboard. It parses Claude Code transcript files stored in `~/.claude/projects` and provides token usage tracking, cost estimation, and visualization capabilities.

## Core Value

Help users monitor and understand their Claude Code token consumption and costs with accurate, real-time data.

## Requirements

### Validated

- ✓ CLI usage summary command (`/usage`)
- ✓ Web dashboard with charts (`/usage-dashboard`)
- ✓ Price configuration management (`/usage-config-price`)
- ✓ Token usage tracking by model, project, and session
- ✓ Cost estimation with configurable model prices
- ✓ Cross-platform support (macOS, Linux)
- ✓ Date/model/project filtering in CLI and Dashboard
- ✓ Dark mode support in dashboard
- ✓ **Internationalization (i18n)**: Chinese and English language toggle — Added 2026-04-02
- ✓ **Cyberpunk Terminal UI aesthetic**: Modern dark theme design — Added 2026-04-02
- ✓ **Total turns tracking**: Conversation turns in summary cards — Added 2026-04-02
- ✓ Plugin marketplace registration
- ✓ GitHub repository accessible (KingsFish/tokenmeter) — Validated in Phase 1
- ✓ Marketplace installation works (`claude plugin install tokenmeter`) — Validated in Phase 1
- ✓ All three commands work after fresh installation — Validated in Phase 1
- ✓ zsh shell compatibility — Validated in Phase 1

### Active

- [ ] Real-time tracking via Claude Code hooks (Phase 2)
- [ ] Settings page button layout improvement
- [ ] UI modernization with frontend-dev skill
- [ ] Data loading performance optimization

### Out of Scope

- Real-time chat — High complexity, not core to usage tracking
- OAuth login — Not applicable for local plugin
- Native mobile app — Web-first, mobile browser sufficient

## Context

**Technical Environment:**
- Bash scripts for core parsing logic (jq for JSON processing)
- Python HTTP server for web dashboard (standard library only)
- Vanilla JavaScript frontend with Chart.js from CDN
- No build step required - pure interpreted scripts

**Existing Codebase:**
- Well-structured plugin with clear separation of concerns
- Commands in `commands/*.md`, scripts in `scripts/`, frontend in `dashboard/`
- Price configuration stored in `~/.claude/tokenmeter/prices.json`

**User Feedback:**
- Plugin is functional and being used
- Feature requests tracked in ROADMAP.md

## Constraints

- **Dependencies:** Requires `jq` and `python3` installed
- **Platform:** macOS and Linux fully supported, Windows requires WSL
- **No Build:** Must remain pure scripts without compilation
- **CDN Dependency:** Chart.js loaded from CDN (fallback available)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bash + jq for parsing | Lightweight, no dependencies beyond standard tools | ✓ Good - fast and reliable |
| Python for HTTP server | Standard library only, no pip dependencies | ✓ Good - simple deployment |
| Vanilla JS frontend | No build step, easy to maintain | ✓ Good - lightweight |
| Chart.js from CDN | No bundling required, always latest | — Pending - offline support? |
| JSONL transcript parsing | Direct access to Claude Code data | ✓ Good - real data source |
| zsh nullglob in commands | Prevents glob errors in zsh shell | ✓ Good - broader shell support |
| i18n module (zh/en) | Chinese user support, global accessibility | ✓ Good - toggle in header |
| Cyberpunk Terminal UI | Distinctive modern aesthetic, dark theme | ✓ Good - terminal vibe |

---
*Last updated: 2026-04-02 after documentation sync*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state