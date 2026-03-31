# Structure

**Project:** TokenMeter
**Generated:** 2026-03-31

## Directory Layout

```
tokenmeter/
├── .claude-plugin/          # Plugin configuration
│   ├── plugin.json          # Plugin metadata
│   └── marketplace.json     # Marketplace registration
│
├── commands/                # Claude Code commands
│   ├── usage.md             # /usage command
│   ├── usage-dashboard.md   # /usage-dashboard command
│   └── usage-config-price.md # /usage-config-price command
│
├── config/                  # Default configuration
│   └── prices.json          # Default model prices
│
├── dashboard/               # Web dashboard frontend
│   ├── index.html           # Main dashboard page
│   ├── app.js               # Dashboard application logic
│   ├── style.css            # Styles (with dark mode)
│   ├── settings.html        # Settings page
│   └── settings.js          # Settings page logic
│
├── scripts/                 # Core scripts
│   ├── parse-usage.sh       # Main parsing logic
│   ├── price-config.sh      # Price configuration CLI
│   ├── start-dashboard.sh   # Dashboard launcher
│   └── dashboard-server.py  # HTTP server for dashboard
│
├── README.md                # Documentation
├── ROADMAP.md               # Project roadmap
└── LICENSE                  # MIT License
```

## Key Locations

| Path | Purpose |
|------|---------|
| `commands/*.md` | Claude Code slash command definitions |
| `scripts/*.sh` | Core Bash scripts for data processing |
| `scripts/*.py` | Python HTTP server |
| `dashboard/*.js` | Frontend JavaScript logic |
| `dashboard/*.html` | Frontend HTML pages |
| `dashboard/*.css` | Frontend styles |
| `config/prices.json` | Default pricing configuration |
| `.claude-plugin/` | Plugin metadata for Claude Code |

## File Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Bash scripts | kebab-case | `parse-usage.sh`, `price-config.sh` |
| Python files | kebab-case | `dashboard-server.py` |
| JavaScript | lowercase | `app.js`, `settings.js` |
| HTML | lowercase | `index.html`, `settings.html` |
| CSS | lowercase | `style.css` |
| Config JSON | lowercase | `prices.json`, `plugin.json` |
| Commands | kebab-case | `usage-dashboard.md` |

## Generated/Transient Files

| Location | Purpose | Lifecycle |
|----------|---------|-----------|
| `~/.claude/tokenmeter/prices.json` | User price config | Persistent |
| `/tmp/*.tmp` | Temporary jq processing | Transient |

## Configuration Locations

| Config | Location | Priority |
|--------|----------|----------|
| User prices | `~/.claude/tokenmeter/prices.json` | 1 (highest) |
| Plugin defaults | `config/prices.json` | 2 |

## Asset Organization

### No Build Artifacts

This project has no build step. All files are source files executed directly.

### External Assets

| Asset | Source | Loading |
|-------|--------|---------|
| Chart.js | CDN | Runtime via `<script>` |

## Test Structure

Currently no dedicated test directory. Testing is manual via CLI commands and dashboard.

## Documentation Structure

| File | Purpose |
|------|---------|
| `README.md` | User documentation, installation, usage |
| `ROADMAP.md` | Feature roadmap and planning |