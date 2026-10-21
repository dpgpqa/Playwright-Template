import { test, expect } from '@fixtures/base.fixture';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';
import { CartPage } from '@pages/CartPage';
import { Header } from '@components/Header';

test.describe('Smoke: Critical user flows @smoke', () => {
  test('homepage loads and shows products link @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(home.getProductsLink()).toBeVisible();
  });

  test('login page loads and shows form @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.getPage().locator('.login-form h2')).toBeVisible();
  });

  test('invalid login shows error @smoke', async ({ loginPage, freshContextPage }) => {
    const login = new LoginPage(freshContextPage);
    await login.goto();
    await login.login('invalid@example.com', 'wrongpass');
    await expect(freshContextPage.getByText('Your email or password is incorrect!')).toBeVisible();
  });

  test('products page loads and shows items @smoke', async ({ productsPage }) => {
    await productsPage.goto();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('add to cart from products page @smoke', async ({ productsPage, cartPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();
    await expect(cartPage.getCartTable()).toBeVisible();
    const items = await cartPage.getItemCount();
    expect(items).toBeGreaterThanOrEqual(1);
  });
});