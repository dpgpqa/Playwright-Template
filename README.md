# Playwright QA Template

[![CI](https://github.com/dpgpqa/Playwright-Template/actions/workflows/ci.yml/badge.svg)](https://github.com/dpgpqa/Playwright-Template/actions/workflows/ci.yml) [![Playwright](https://img.shields.io/badge/Playwright-1.64.1-2EAD33?logo=playwright)](https://playwright.dev/) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Enterprise-grade Playwright template for **UI testing (AutomationExercise)** + **API testing (DummyJSON + AutomationExercise API)**.

Clone, point at your app, ship with confidence. E2E · API · Visual · Accessibility · Performance — from a single toolchain.

The template ships **pre-wired against [automationexercise.com](https://automationexercise.com)** so it works the moment you clone it. Adopt it by swapping `BASE_URL` to your app and adapting the page objects.

---

## Contents

1. [Philosophy](#philosophy)
2. [What you get](#what-you-get)
3. [Quick Start](#quick-start)
4. [Project Layout](#project-layout)
5. [The Page Object Model](#the-page-object-model)
6. [Fixtures & Worker-Scoped Auth](#fixtures--worker-scoped-auth)
7. [Test Data & Factories](#test-data--factories)
8. [Tagging Strategy](#tagging-strategy)
9. [Playwright CLI Reference](#playwright-cli-reference)
10. [Best Practices & Guardrails](#best-practices--guardrails)
11. [Branch Protection & Merge Workflow](#branch-protection--merge-workflow)
12. [Security](#security)
13. [CI / CD](#ci--cd)
14. [Environment Variables](#environment-variables)
15. [Scripts](#scripts)
16. [Pre-commit hooks](#pre-commit-hooks)
17. [Adapting to Your App](#adapting-to-your-app)
18. [Documentation](#documentation)

---

## Philosophy

- **One framework, all layers.** Playwright handles E2E, API, and visual testing natively. axe-core for a11y runs inside the same browser. No extra HTTP clients, no second runner.
- **Fast feedback first.** Smoke + API run on every push in under 2 minutes, sharded. Full regression runs nightly or on demand.
- **Enterprise defaults.** Worker-scoped auth, zod-validated test data, typed factories, pre-commit hooks, sharded reports merged into a single HTML artifact.
- **Free by default.** GitHub Actions, Playwright, axe-core, Lighthouse CI — all free for public repos and generous on private.
- **You own it.** This is not a framework you import. Every file is yours to modify.

---

## What you get

| Layer | Tool | Cost |
|-------|------|------|
| E2E, API, visual | [Playwright](https://playwright.dev) 1.64 + TypeScript 5.6 | Free / OSS |
| Accessibility | [axe-core](https://github.com/dequelabs/axe-core) via `@axe-core/playwright` | Free / OSS |
| Schema validation | [zod](https://zod.dev) 3 | Free / OSS |
| Performance | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | Free / OSS |
| Static analysis | TypeScript + ESLint | Free / OSS |
| Dependency review | GitHub Dependabot | Free on GitHub |
| Pre-commit gates | husky 9 + lint-staged 17 | Free / OSS |
| CI/CD | GitHub Actions | Free tier |

---

## Quick Start

```bash
# 1. Install
npm ci
npx playwright install --with-deps chromium

# 2. Optional — point at your own app (defaults to automationexercise.com)
cp .env.example .env.local   # edit BASE_URL / TEST_USER_EMAIL / TEST_USER_PASSWORD

# 3. Smoke test
npm run test:smoke

# 4. Open the report
npm run report
```

You should see 5 smoke tests pass against automationexercise. Full suite (`npm test`) runs in under 30 seconds locally.

---

## Project Layout

```
.
├── src/
│   ├── pages/                    POM: one file per page or major flow
│   │   ├── BasePage.ts           abstract base — `goto()`, `waitForLoad()`
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── PaymentPage.ts
│   │   └── SignupPage.ts
│   │
│   ├── components/               reusable sub-page objects
│   │   └── Header.ts             cart badge, menu, logout
│   │
│   ├── api/                      typed REST wrappers with zod schemas
│   │   ├── automationExerciseApi.ts      # Zod schemas
│   │   ├── dummyJsonApi.ts               # Zod schemas
│   │   ├── AutomationExerciseApiClient.ts
│   │   └── DummyJsonApiClient.ts
│   │
│   ├── fixtures/                 Playwright test extensions
│   │   ├── base.fixture.ts       page objects + worker-scoped auth
│   │   ├── global.setup.ts       env validation + stale-auth cleanup
│   │   └── global.teardown.ts    CI session wipe
│   │
│   ├── factories/                typed test-data factories
│   │   └── index.ts
│   │
│   └── utils/
│       ├── testData.ts           zod-validated JSON loader
│       ├── random.ts             crypto-backed random helpers
│       └── environmentCheck.ts   exponential backoff poller for BASE_URL
│
├── tests/
│   ├── smoke/                    @smoke — critical path (< 2 min total)
│   ├── regression/               @regression — full coverage, nightly
│   ├── api/                      @api — contract + availability
│   ├── accessibility/            @a11y — axe-core WCAG 2.1 AA
│   └── visual/                   @visual — screenshot diffs
│
├── test-data/                    static JSON, zod-validated at load
│   ├── users.json
│   └── products.json
│
├── .github/
│   ├── workflows/                ci
│   ├── ISSUE_TEMPLATE/
│   ├── CODEOWNERS                auto-assign reviewers per path
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
│
├── .husky/                       pre-commit + pre-push hooks
├── .auth/                        gitignored — per-worker storage state
├── reports/                      gitignored — HTML + JSON output
├── blob-report/                  gitignored — sharded blob output
│
├── playwright.config.ts
├── lighthouserc.yml
├── eslint.config.mjs
├── tsconfig.json
├── package.json
├── CONTRIBUTING.md               PR + coding standards
├── SECURITY.md                   secret handling + threat model
└── TODO.md                       adapt-the-template checklist
```

---

## The Page Object Model

Every page extends `BasePage` and follows the same shape. Locators are private, methods are named for user intent, no `expect()` lives in a POM.

### Base class

```ts
// src/pages/BasePage.ts
import { Page, Response } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected abstract readonly path: string;

  async goto(): Promise<Response | null> {
    const res = await this.page.goto(this.path);
    await this.waitForLoad();
    return res;
  }

  abstract waitForLoad(): Promise<void>;

  url(): string {
    return this.page.url();
  }

  getPage(): Page {
    return this.page;
  }
}
```

### Page class — the pattern

```ts
// src/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  // Private locator fields — never exposed to tests.
  private readonly emailInput = this.page.getByTestId('login-email');
  private readonly passwordInput = this.page.getByTestId('login-password');
  private readonly submitButton = this.page.getByTestId('login-button');
  private readonly errorMessage = this.page.locator('.login-form .text-danger');
  private readonly signupName = this.page.getByTestId('signup-name');
  private readonly signupEmail = this.page.getByTestId('signup-email');
  private readonly signupButton = this.page.getByTestId('signup-button');
  private readonly loginFormTitle = this.page.locator('.login-form h2');

  // Wait for a reliable page-ready indicator. No expect() — that belongs in tests.
  async waitForLoad(): Promise<void> {
    await this.loginFormTitle.waitFor({ state: 'visible' });
  }

  // Method names describe user intent, not implementation details.
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWaitForHome(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // Wait for either home page or error message
    await Promise.race([
      this.page.waitForURL('**/', { timeout: 20000 }),
      this.page.waitForURL('**/login', { timeout: 20000 }),
    ]);
  }

  async signup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
```

### Component class — for shared UI

Components don't extend `BasePage`. They take a `Page` and expose actions on a recurring UI fragment (header, modal, drawer).

```ts
// src/components/Header.ts
export class Header {
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly deleteAccountLink: Locator;
  private readonly loggedInAs: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.loginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.loggedInAs = page.locator('li:has-text("Logged in as")');
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
    await this.page.waitForURL('**/products');
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/view_cart');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL('**/');
  }

  getLoggedInAs() { return this.loggedInAs; }
  async getLoggedInUsername(): Promise<string | null> { /* ... */ }
}
```

### POM rules — non-negotiable

1. **Extend `BasePage`** for full pages. Components take `Page` directly.
2. **Locators are `private readonly`**. Tests never touch raw locators.
3. **No `expect()` inside a POM.** Use `locator.waitFor()` for readiness. Assertions belong in tests.
4. **Methods describe user intent.** `login()`, not `clickLoginButton()`.
5. **Named exports only.** No default exports.
6. **One file per page or major flow.** Don't extract a class for a single button.
7. **`waitForLoad()` is required.** Assert (via `waitFor`, not `expect`) that the page is truly ready.

---

## Fixtures & Worker-Scoped Auth

Tests **import `test` from `src/fixtures/base.fixture.ts`** — never from `@playwright/test` directly — to get page objects + worker-scoped auth.

```ts
import { test, expect } from '@fixtures/base.fixture';
import { LoginPage } from '@pages/LoginPage';

test('authenticated flow', async ({ homePage, header }) => {
  await homePage.goto();
  await expect(header.getLoggedInAs()).toBeVisible();
});

test('negative login', async ({ freshContextPage }) => {
  const login = new LoginPage(freshContextPage);
  await login.goto();
  await login.login('bad@email.com', 'wrong');
  // ...
});
```

### How it works

| Phase | File | Responsibility |
|-------|------|----------------|
| Per-run | `src/fixtures/global.setup.ts` | Validate env vars, enforce URL shape, wipe stale `.auth/user-*.json` from prior runs (skip with `PW_KEEP_AUTH=1`) |
| Post-run | `src/fixtures/global.teardown.ts` | Wipe **all** `.auth/*.json` in CI so session cookies never leak into uploaded artifacts |
| Per-test | `page` fixture override | Run `Header.resetAppState()` after each authenticated test — reset failures attached to test results, not swallowed |

---

## Test Data & Factories

Static data lives in `test-data/` as JSON, loaded through zod-validated loaders in `src/utils/testData.ts`:

```ts
const users = loadJSON('users.json', z.array(UserSchema));
const products = loadJSON('products.json', z.array(ProductSchema));
```

Dynamic data via Faker.js factories in `src/factories/index.ts`:

```ts
import { createSignupData, createAddressData, createPaymentData } from '@factories';

const signup = createSignupData();      // { title, name, email, password, ... }
const address = createAddressData();    // { firstName, lastName, address1, ... }
const payment = createPaymentData();    // { nameOnCard, cardNumber, cvc, ... }
```

---

## Tagging Strategy

| Tag | Purpose | When it runs |
|-----|---------|--------------|
| `@smoke` | Critical happy-path (< 2 min) | Every push, PR |
| `@regression` | Full coverage | Nightly, on-demand |
| `@api` | Contract + availability | Every push |
| `@a11y` | axe-core WCAG 2.1 AA | Every push |
| `@visual` | Screenshot diffs | On-demand / PR |

---

## Playwright CLI Reference

```bash
# Run suites
npx playwright test --grep @smoke --project=chromium
npx playwright test --grep @regression
npx playwright test --grep @api --project=chromium
npx playwright test --grep @a11y --project=chromium
npx playwright test --grep @visual

# Visual baselines
npx playwright test --grep @visual --project=chromium --update-snapshots

# Debug
npx playwright test --ui
npx playwright test --debug
npx playwright test --headed --project=chromium

# Reports
npx playwright show-report reports/html
npx playwright merge-reports --reporter=html ./blob-report
```

---

## Best Practices & Guardrails

### Test structure — Arrange → Act → Assert

```ts
test('user can add to cart @regression', async ({ productsPage, header, cartPage }) => {
  // Arrange
  await productsPage.goto();

  // Act
  await productsPage.addToCartByIndex(0);
  await header.goToCart();

  // Assert
  expect(await cartPage.getItemCount()).toBe(1);
});
```

### Flake prevention

See [`docs/flake-handling.md`] for the full playbook:

- **Prefer `expect.poll` over `waitForTimeout`** — retries with backoff
- **Mark flaky tests with `@quarantine`** — runs separately, doesn't block merge
- **Use `test.slow()`** for known-slow tests — triples timeout
- **Never hardcode sleeps** — wait for networkidle, URL, or element state

---

## Branch Protection & Merge Workflow

### Contributor workflow (non-admin)

| Type | Pattern | Example |
|------|---------|---------|
| Feature / new test | `feat/<ticket>-<slug>` | `feat/PROJ-123-checkout-tests` |
| Bug fix | `fix/<ticket>-<slug>` | `fix/QA-456-login-selector` |
| POM addition | `pom/<page-name>` | `pom/checkout-page` |
| Chore / config | `chore/<slug>` | `chore/update-playwright` |
| Release | `release/<version>` | `release/v2.1.0` |

### Required checks before merge

- All CI jobs green (lint, typecheck, smoke, api, a11y, regression)
- No unresolved review comments
- Branch up-to-date with `template-init`

---

## Security

Read [`SECURITY.md`](SECURITY.md) for the full policy. Summary:

- **Never commit secrets.** `.env.local` is gitignored.
- **Rotate tokens** quarterly (see `docs/contacts.md`).
- **Secrets in CI** only via GitHub Actions secrets.
- **No sensitive data in test artifacts** — global teardown wipes `.auth/`.

---

## CI / CD

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | push, PR to `template-init` | lint-and-typecheck, test-smoke, test-api, test-a11y, test-regression |
| `security.yml` | schedule, push | CodeQL, gitleaks, dependency review |

### Artifacts

- `reports/html` — merged HTML report (merged from shards via `blob-report`)
- `test-results/` — raw JUnit + trace + screenshots
- `blob-report/` — sharded blob output for merge

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Target application (UI)
BASE_URL=https://automationexercise.com

# API bases
DUMMYJSON_BASE_URL=https://dummyjson.com
AUTOMATION_EXERCISE_API_BASE=https://automationexercise.com/api

# Test credentials (AutomationExercise)
TEST_USER_EMAIL=qa_bot@example.com
TEST_USER_PASSWORD=Passw0rd!

# DummyJSON credentials (pre-seeded users: emilys/emilyspass)
DUMMYJSON_USERNAME=emilys
DUMMYJSON_PASSWORD=emilyspass
```

---

## Scripts

```bash
# Test suites
npm test              # All tests
npm run test:smoke    # @smoke only (chromium)
npm run test:regression
npm run test:api
npm run test:a11y
npm run test:visual
npm run test:visual:update  # Regenerate snapshots

# Dev tools
npm run test:ui       # Playwright UI mode
npm run test:debug    # Debug mode
npm run test:headed   # Headed browser

# Quality
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run lint:fix
npm run format        # Prettier
npm run format:check
```

---

## Pre-commit hooks

Husky runs on every commit:

```bash
# .husky/pre-commit
npx lint-staged
```

```json
// package.json
"lint-staged": {
  "*.{ts,js,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,yml,md}": ["prettier --write"]
}
```

---

## Adapting to Your App

| Change | Where |
|--------|-------|
| Target URL | `.env.local` → `BASE_URL` |
| Credentials | `.env.local` → `TEST_USER_*` |
| Login flow | `src/fixtures/base.fixture.ts` → `workerStorageState` fixture |
| Test ID attribute | `playwright.config.ts` → `use.testIdAttribute` (currently `data-qa`) |
| Page objects | Adapt or replace `src/pages/*.ts` |
| Test data | Update `test-data/*.json` + zod schemas in `src/api/*.ts` |
| Factories | Update `src/factories/*.ts` |
| Performance thresholds | `lighthouserc.yml` |
| CI secrets | GitHub Settings → Secrets and variables → Actions |
| Code owners | `.github/CODEOWNERS` |

---

## Documentation

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — PR workflow + coding standards
- [`SECURITY.md`](SECURITY.md) — secret handling, threat model, reporting
- [`TODO.md`](TODO.md) — adapt-the-template checklist
- [`tests/visual/README.md`](tests/visual/README.md) — baseline-per-browser convention
- [`docs/flake-handling.md`](docs/flake-handling.md) — flake taxonomy + playbook
- [`docs/contacts.md`](docs/contacts.md) — team contacts, Jira keys, escalation, token rotation

---

## License

[MIT](LICENSE).