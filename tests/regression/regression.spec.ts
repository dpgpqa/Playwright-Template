import { test, expect } from '@fixtures/base.fixture';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';
import { CartPage } from '@pages/CartPage';
import { Header } from '@components/Header';

test.describe('Regression: Full e2e flows @regression', () => {
  (process.env.CI ? test.skip : test)('remove item from cart @regression', async ({ productsPage, cartPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();

    const before = await cartPage.getItemCount();
    expect(before).toBeGreaterThan(0);

    await cartPage.removeItemByIndex(0);
    const after = await cartPage.getItemCount();
    expect(after).toBe(before - 1);
  });
});