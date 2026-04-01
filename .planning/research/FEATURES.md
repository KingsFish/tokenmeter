# Features Research

**Project:** TokenMeter
**Focus:** Feature landscape for token usage tracking tools
**Generated:** 2026-04-01

## Executive Summary

TokenMeter already covers core features. Key gaps are real-time tracking, data export, and usage alerts - all planned in ROADMAP.md.

## Feature Categories

### Table Stakes (Must Have)

| Feature | Status | Notes |
|---------|--------|-------|
| Token counting | ✓ Have | Accurate per-session |
| Cost estimation | ✓ Have | Configurable prices |
| Historical data | ✓ Have | All sessions tracked |
| Multi-model support | ✓ Have | Per-model breakdown |
| Project grouping | ✓ Have | By project path |
| CLI access | ✓ Have | /usage command |
| Web dashboard | ✓ Have | Charts and tables |
| Filtering (date/model/project) | ✓ Have | CLI and dashboard |
| Dark mode | ✓ Have | Auto-detect |

### Differentiators (Competitive Advantage)

| Feature | Status | Priority |
|---------|--------|----------|
| Real-time tracking | Planned (v1.2) | High |
| Usage alerts/notifications | Planned (v1.5+) | Medium |
| Data export (CSV/JSON) | Planned (v1.5+) | Medium |
| Session detail view | Planned (v1.5+) | Medium |
| Team aggregation | Planned (v1.5+) | Low |
| Price optimization suggestions | Not planned | Low |
| Budget tracking | Not planned | Medium |

### Anti-features (Deliberately NOT Building)

| Feature | Reason |
|---------|--------|
| Cloud sync | Local-first philosophy |
| User accounts | Local plugin, no server |
| Mobile native app | Web dashboard sufficient |
| Real-time chat | Not core value |
| OAuth integration | Not applicable |

## Feature Comparison

### Similar Tools

| Tool | Real-time | Export | Alerts | Cost |
|------|-----------|--------|--------|------|
| TokenMeter | Planned | Planned | Planned | Free |
| OpenAI Usage API | ✓ | ✓ | ✓ | Free |
| Vercel Analytics | ✓ | ✓ | ✓ | Paid |
| Datadog | ✓ | ✓ | ✓ | Paid |

### Feature Complexity Estimates

| Feature | Complexity | Dependencies |
|---------|------------|--------------|
| Real-time via hooks | Medium | Claude Code hooks |
| SSE for dashboard | Low | Python server |
| Usage alerts | Medium | Notification system |
| CSV export | Low | File generation |
| JSON export | Low | File generation |
| Session detail | Medium | UI complexity |
| Budget tracking | Medium | Config storage |
| Team aggregation | High | Architecture change |

## User Pain Points (Research-Based)

1. **Blind usage** - Don't know cost until session ends
2. **No alerts** - Can exceed budget without warning
3. **Manual tracking** - Need to check dashboard proactively
4. **No export** - Can't analyze in spreadsheets
5. **Slow loading** - Large datasets slow dashboard

## Recommended Prioritization

1. **Real-time tracking** - Addresses pain point #1
2. **Performance optimization** - Addresses pain point #5
3. **Data export** - Addresses pain point #4
4. **Usage alerts** - Addresses pain point #2
5. **Session details** - Enhancement

---
*Research completed: 2026-04-01*