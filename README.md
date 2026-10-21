# Playwright QA Template

Enterprise-grade Playwright template for **UI testing (AutomationExercise)** + **API testing (DummyJSON + AutomationExercise API)**.

## Quick Start

```bash
# Clone and install
git clone <your-fork> playwright-qa
cd playwright-qa
npm ci

# Copy env and configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Run smoke tests (should pass in ~30s)
npm run test:smoke

# Full suite
npm test
```

## What's Included

| Layer | Technology | Targets |
|-------|------------|---------|
| **UI E2E** | Playwright + TypeScript | [AutomationExercise](https://automationexercise.com) |
| **API** | Playwright APIRequest + Zod | [DummyJSON](https://dummyjson.com) + [AutomationExercise API](https://automationexercise.com/api_list) |
| **Page Objects** | POM pattern (BasePage + components) | 8 pages + Header component |
| **Fixtures** | Worker-scoped auth, fresh contexts | Isolated test sessions |
| **Test Data** | Zod-validated JSON + Faker factories | Type-safe data layer |
| **Visual** | Playwright snapshots | Cross-browser baselines |
| **Accessibility** | axe-core/playwright | WCAG 2.1 AA checks |
| **TypeScript** | Strict mode, path aliases | `@pages/`, `@api/`, `@fixtures/`, etc. |

## Project Structure

```
.
├── src/
│   ├── pages/                 # Page Objects (POM)
│   │   ├── BasePage.ts        # Abstract base: goto(), waitForLoad()
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── PaymentPage.ts
│   │   └── SignupPage.ts
│   ├── components/            # Reusable UI fragments
│   │   └── Header.ts
│   ├── api/                   # Typed API clients (Zod schemas)
│   │   ├── automationExerciseApi.ts      # Zod schemas
│   │   ├── dummyJsonApi.ts               # Zod schemas
│   │   ├── AutomationExerciseApiClient.ts
│   │   └── DummyJsonApiClient.ts
│   ├── fixtures/              # Playwright test extensions
│   │   ├── base.fixture.ts    # Page objects + worker-scoped auth
│   │   ├── global.setup.ts    # Env validation + stale-auth cleanup
│   │   └── global.teardown.ts # CI session wipe
│   ├── factories/             # Faker.js test data factories
│   │   └── index.ts
│   └── utils/
│       ├── random.ts          # Helpers
│       ├── testData.ts        # Zod-validated JSON loaders
│       └── environmentCheck.ts
├── test-data/
│   ├── users.json
│   └── products.json
├── tests/
│   ├── smoke/                 # @smoke - critical paths (< 2 min)
│   ├── regression/            # @regression - full flows
│   ├── api/                   # @api - API contract tests
│   ├── accessibility/         # @a11y - axe-core checks
│   └── visual/                # @visual - screenshot diffs
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

## Test Targets

### UI: AutomationExercise
- **Base URL**: `https://automationexercise.com`
- **Selectors**: `data-qa` attributes (configured via `testIdAttribute`)
- **Flows**: Home → Products → Cart → Checkout → Payment
- **Auth**: Email/password login, signup, logout, account deletion

### API: DummyJSON
- **Base**: `https://dummyjson.com`
- **Endpoints**: Products, Users, Auth, Carts
- **Auth**: JWT (access/refresh tokens)
- **CRUD**: Full product lifecycle (create, read, update, delete)

### API: AutomationExercise
- **Base**: `https://automationexercise.com/api`
- **Endpoints**: Products, Brands, Account (create, verify, delete)

## Commands

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

## Configuration

### Environment Variables (`.env.local`)
```bash
# UI
BASE_URL=https://automationexercise.com
TEST_USER_EMAIL=your@email.com
TEST_USER_PASSWORD=yourpassword

# API
DUMMYJSON_BASE_URL=https://dummyjson.com
AUTOMATION_EXERCISE_API_BASE=https://automationexercise.com/api
DUMMYJSON_USERNAME=emilys
DUMMYJSON_PASSWORD=emilyspass
```

### Playwright Config (`playwright.config.ts`)
- Projects: Chromium, Firefox, WebKit
- Worker-scoped auth via `.auth/user-<worker>.json`
- `testIdAttribute: 'data-qa'` for AutomationExercise
- Retries: 2 in CI, 0 locally
- Trace on first retry, screenshots on failure

## Page Object Rules

1. Extend `BasePage` for full pages
2. Components take `Page` directly (no `BasePage`)
3. Locators are `private readonly`
4. **No `expect()` in POMs** — use `locator.waitFor()` for readiness
5. Method names = user intent (`login()`, not `clickLoginButton()`)
6. Named exports only
7. `waitForLoad()` required — asserts page is ready

## Fixtures Usage

```ts
import { test, expect } from '@fixtures/base.fixture';
import { LoginPage } from '@pages/LoginPage';

// Authenticated page (worker-scoped session)
test('authenticated flow', async ({ homePage, header }) => {
  await homePage.goto();
  await expect(header.loggedInAs).toBeVisible();
});

// Fresh unauthenticated context
test('negative login', async ({ freshContextPage }) => {
  const login = new LoginPage(freshContextPage);
  await login.goto();
  await login.login('bad@email.com', 'wrong');
  // ...
});
```

## API Client Usage

```ts
import { test, expect } from '@fixtures/base.fixture';
import { DummyJsonApiClient } from '@api/DummyJsonApiClient';

test('API: create product', async () => {
  const api = await DummyJsonApiClient.create();
  await api.login('emilys', 'emilyspass');
  const product = await api.addProduct({ title: 'Test', price: 9.99, category: 'test' });
  expect(product.id).toBeGreaterThan(0);
  await api.deleteProduct(product.id);
  api.dispose();
});
```

## Visual Regression

```bash
# Generate baselines (run on target OS!)
npm run test:visual:update

# CI runs on Linux — generate baselines there or in a container
```

See [`tests/visual/README.md`](tests/visual/README.md) for details.

## Accessibility

```bash
npm run test:a11y
```
Runs axe-core on key pages. Fails on `critical` + `serious` violations.

## Adapting to Your App

| Change | Where |
|--------|-------|
| Target URL | `.env.local` → `BASE_URL` |
| Credentials | `.env.local` → `TEST_USER_*` |
| Login flow | `src/fixtures/base.fixture.ts` → `workerStorageState` |
| Test ID attribute | `playwright.config.ts` → `use.testIdAttribute` |
| Page objects | Adapt/replace `src/pages/*.ts` |
| Test data | Update `test-data/*.json` + zod schemas |
| Factories | Update `src/factories/*.ts` |

## Requirements

- Node.js ≥ 22
- Playwright browsers (installed via `npx playwright install`)

## License

MIT