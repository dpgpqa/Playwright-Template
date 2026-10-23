# SLOs & Test Coverage

## Service Level Objectives

| Metric | Target | Measurement |
|--------|--------|-------------|
| Smoke test pass rate | ≥ 95% | Per CI run |
| Regression test pass rate | ≥ 90% | Per nightly run |
| API test pass rate | ≥ 95% | Per CI run |
| Flakiness rate | < 5% | Per week |
| Test execution time (smoke) | < 5 minutes | Per CI run |
| Test execution time (full) | < 30 minutes | Per CI run |
| Critical bug escape rate | < 1 per release | Per release |

## Test Coverage Targets

| Layer | Coverage Target | Tool |
|-------|----------------|------|
| UI (smoke) | 80% of critical paths | Playwright + NYC |
| API | 90% of endpoints | Playwright + NYC |
| Accessibility | 100% of a11y-tagged pages | axe-core |

## How to Read Coverage Reports

Run `npm run test:coverage` to generate:
- `coverage/index.html` — HTML report
- `coverage/cobertura-coverage.xml` — Cobertura XML for CI integration
- `coverage/coverage-final.json` — Raw JSON data

Thresholds are configured in `nyc.config.js`. Tests will fail if coverage drops below:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## SLO Dashboard

CI failure notifications create GitHub issues with the `ci-failure` label. Review weekly to track SLO compliance.
