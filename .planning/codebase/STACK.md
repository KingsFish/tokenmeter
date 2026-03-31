# Stack

**Project:** TokenMeter
**Type:** Claude Code Plugin
**Generated:** 2026-03-31

## Languages

| Language | Purpose | Version |
|----------|---------|---------|
| Bash | Core parsing logic, CLI commands | 3.2+ |
| Python | HTTP server for web dashboard | 3.8+ |
| JavaScript | Frontend dashboard application | ES6+ |
| HTML/CSS | Dashboard UI | HTML5, CSS3 |

## Runtime Environment

- **Shell:** Bash (POSIX-compatible)
- **Python:** Standard library only (no external dependencies)
- **Browser:** Modern browsers with ES6 support

## Dependencies

### System Dependencies

| Dependency | Purpose | Required |
|------------|---------|----------|
| `jq` | JSON processing in Bash scripts | Yes |
| `python3` | Dashboard HTTP server | Yes |

### Frontend Dependencies

| Dependency | Version | Purpose | Source |
|------------|---------|---------|--------|
| Chart.js | 4.4.1 | Data visualization charts | CDN |

**Note:** No npm/package.json - Chart.js is loaded via CDN with fallback.

## Configuration Files

| File | Purpose |
|------|---------|
| `config/prices.json` | Default model pricing configuration |
| `.claude-plugin/plugin.json` | Plugin metadata |
| `.claude-plugin/marketplace.json` | Marketplace registration |

## Build & Install

No build step required. Pure scripts interpreted at runtime.

**Installation via Marketplace:**
```bash
claude marketplace add KingsFish/tokenmeter
claude plugin install tokenmeter
```

## Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| macOS | Full | Primary development platform |
| Linux | Full | Tested on Ubuntu/Debian |
| Windows | Partial | Requires WSL or Git Bash |

## Data Storage

| Data | Location | Format |
|------|----------|--------|
| Claude transcripts | `~/.claude/projects/*/*.jsonl` | JSONL |
| User price config | `~/.claude/tokenmeter/prices.json` | JSON |