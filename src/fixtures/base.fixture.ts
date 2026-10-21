import { test as base, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { SignupPage } from '@pages/SignupPage';
import { Header } from '@components/Header';
import * as fs from 'fs';
import * as path from 'path';

type WorkerFixtures = {
  workerStorageState: string;
};

type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  signupPage: SignupPage;
  header: Header;
  freshContextPage: Page;
};

export const test = base.extend<TestFixtures & WorkerFixtures>({
  // Worker-scoped auth: each worker logs in once and reuses the session
  workerStorageState: async ({}, use) => {
    const authDir = path.resolve('.auth');
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    const statePath = path.resolve(authDir, `user-${process.env.TEST_WORKER_INDEX || '0'}.json`);
    await use(statePath);
  },

  // Browser context with worker-scoped storage state
  context: async ({ browser, workerStorageState }, use) => {
    let context: BrowserContext;
    if (fs.existsSync(workerStorageState)) {
      context = await browser.newContext({ storageState: workerStorageState });
    } else {
      context = await browser.newContext();
    }
    await use(context);
    await context.close();
  },

  // Authenticated page (uses worker-scoped context)
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },

  // Fresh unauthenticated context/page for negative tests
  freshContextPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Page objects
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
});

export const expect = test.expect;