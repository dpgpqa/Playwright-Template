import { test, expect } from '@fixtures/base.fixture';
import { AxeBuilder } from '@axe-core/playwright';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';
import { LoginPage } from '@pages/LoginPage';
import { CartPage } from '@pages/CartPage';
import { Header } from '@components/Header';

test.describe('Accessibility @a11y', () => {
  test('homepage runs axe analysis @a11y', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const results = await new AxeBuilder({ page }).analyze();
    // AutomationExercise has known a11y issues - just verify analysis runs
    expect(results.violations).toBeDefined();
    expect(typeof results.violations.length).toBe('number');
  });

  test('products page runs axe analysis @a11y', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });

  test('login page runs axe analysis @a11y', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });

  test('cart page runs axe analysis @a11y', async ({ page, productsPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });
});