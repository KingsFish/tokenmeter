# Testing

**Project:** TokenMeter
**Generated:** 2026-03-31

## Current State

**No automated tests exist.** Testing is currently manual via:

1. Running CLI commands and verifying output
2. Opening dashboard in browser and checking functionality
3. Inspecting API responses manually

## Manual Testing Procedures

### CLI Testing

**Test `/usage` command:**
```bash
# Basic usage
./scripts/parse-usage.sh --summary

# With filters
./scripts/parse-usage.sh --summary --last 7
./scripts/parse-usage.sh --summary --model claude-sonnet-4-6
./scripts/parse-usage.sh --summary --project tokenmeter
./scripts/parse-usage.sh --summary --from 2026-03-01 --to 2026-03-31
```

**Test `/usage-config-price` command:**
```bash
# Show config
./scripts/price-config.sh

# Add model
./scripts/price-config.sh add test-model 1.0 2.0

# Remove model
./scripts/price-config.sh remove test-model
```

### Dashboard Testing

**Start server:**
```bash
./scripts/start-dashboard.sh
```

**Manual checks:**
1. Open http://localhost:8765
2. Verify summary cards show correct values
3. Verify charts render without errors
4. Test filter functionality (date, model, project)
5. Open settings page
6. Add/remove/edit model prices
7. Verify changes persist

### API Testing

**Test endpoints:**
```bash
# Health check
curl http://localhost:8765/api/health

# Get usage data
curl http://localhost:8765/api/usage

# Get prices
curl http://localhost:8765/api/prices

# Update prices
curl -X POST http://localhost:8765/api/prices \
  -H "Content-Type: application/json" \
  -d '{"model_prices":{},"default_price":{"input_per_million":3.0,"output_per_million":15.0}}'
```

## Testing Gaps

| Area | Gap | Risk |
|------|-----|------|
| jq JSON parsing | No unit tests | Corrupted JSONL may cause unexpected failures |
| Cost calculation | No validation | Incorrect pricing could lead to wrong estimates |
| Date filtering | No edge case tests | Date boundary issues may be missed |
| API responses | No integration tests | API changes may break frontend |
| Chart rendering | No visual tests | Chart errors only caught manually |

## Recommended Testing Strategy

### Unit Tests (Future)

**Bash (using bats-core):**
```
tests/
├── parse-usage.bats       # Test parsing logic
├── price-config.bats      # Test price management
└── fixtures/              # Sample JSONL files
    └── sample.jsonl
```

**JavaScript (using Jest):**
```
tests/
├── app.test.js            # Test utility functions
└── settings.test.js       # Test settings logic
```

### Integration Tests (Future)

```
tests/
└── api.test.js            # Test API endpoints
```

## Test Data

**Location:** No test fixtures currently exist.

**Recommended fixtures:**
- Sample JSONL transcript files with known token counts
- Sample price configurations
- Edge cases: empty sessions, corrupted files, missing fields

## CI/CD

**Current:** None

**Recommended:**
- GitHub Actions workflow
- Run tests on push to main
- Run tests on PRs

## Quality Checks

| Check | Tool | Current Status |
|-------|------|----------------|
| Shell linting | shellcheck | Not configured |
| Python linting | flake8/pylint | Not configured |
| JS linting | ESLint | Not configured |
| JSON validation | jq | Manual only |