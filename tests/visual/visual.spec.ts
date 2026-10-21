import { test, expect } from '@fixtures/base.fixture';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';
import { CartPage } from '@pages/CartPage';
import { Header } from '@components/Header';

test.describe('Visual Regression @visual', () => {
  test('homepage visual snapshot @visual', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixels: 100 });
  });

  test('login page visual snapshot @visual', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(page).toHaveScreenshot('login.png', { fullPage: true, maxDiffPixels: 100 });
  });

  test('products page visual snapshot @visual', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();
    await expect(page).toHaveScreenshot('products.png', { fullPage: true, maxDiffPixels: 200 });
  });

  test('cart page visual snapshot @visual', async ({ page, productsPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true, maxDiffPixels: 150 });
  });
});