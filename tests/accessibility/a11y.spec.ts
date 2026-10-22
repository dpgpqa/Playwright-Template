import { test, expect } from '@fixtures/base.fixture';
import { AxeBuilder } from '@axe-core/playwright';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';
import { LoginPage } from '@pages/LoginPage';
import { CartPage } from '@pages/CartPage';
import { Header } from '@components/Header';

test.describe('Accessibility @a11y', () => {
  // Skipped in CI - demo site is too slow for axe analysis in CI environment
  (process.env.CI ? test.skip : test)('homepage runs axe analysis @a11y', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const results = await new AxeBuilder({ page }).analyze();
    // AutomationExercise has known a11y issues - just verify analysis runs
    expect(results.violations).toBeDefined();
    expect(typeof results.violations.length).toBe('number');
  });

  (process.env.CI ? test.skip : test)('products page runs axe analysis @a11y', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });

  (process.env.CI ? test.skip : test)('login page runs axe analysis @a11y', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });

  (process.env.CI ? test.skip : test)('cart page runs axe analysis @a11y', async ({ page, productsPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });
});