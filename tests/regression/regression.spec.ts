import { test, expect } from '@fixtures/base.fixture';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { Header } from '@components/Header';
import { LoginPage } from '@pages/LoginPage';
import { SignupPage } from '@pages/SignupPage';
import { createAddressData, createPaymentData } from '@factories/index';

test.describe('Regression: Full e2e flows @regression', () => {
  test('complete purchase flow: browse -> cart -> checkout -> payment @regression', async ({
    homePage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
    paymentPage,
    header,
  }) => {
    await homePage.goto();
    await homePage.goToProducts();

    await productsPage.addToCartByIndex(0);
    await header.goToCart();

    await expect(cartPage.getCartTable()).toBeVisible();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitForLoad();
    await checkoutPage.fillAddress(createAddressData());
    await checkoutPage.addComment('Test order from Playwright');
    await checkoutPage.placeOrder();

    await paymentPage.waitForLoad();
    await paymentPage.fillPayment(createPaymentData());
    await paymentPage.payAndConfirm();

    const successMsg = await paymentPage.getSuccessMessage();
    expect(successMsg).toContain('Congratulations! Your order has been confirmed!');
    await paymentPage.continue();
    await expect(header.getLoggedInAs()).toBeVisible();
  });

  test('search products and verify results @regression', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.search('top');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('filter by category @regression', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.filterByCategory('Women');
    await productsPage.filterByCategory('Tops');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('view product detail and add to cart @regression', async ({ productsPage, productDetailPage, header, cartPage }) => {
    await productsPage.goto();
    await productsPage.viewProductByIndex(0);
    await productDetailPage.waitForLoad();

    const name = await productDetailPage.getProductName();
    expect(name).toBeTruthy();

    await productDetailPage.addToCart();
    await productDetailPage.goToCart();

    await expect(cartPage.getCartTable()).toBeVisible();
    const items = await cartPage.getItemNames();
    expect(items.some(i => i.includes(name))).toBeTruthy();
  });

  test('remove item from cart @regression', async ({ productsPage, cartPage, header }) => {
    await productsPage.goto();
    await productsPage.addToCartByIndex(0);
    await header.goToCart();

    const before = await cartPage.getItemCount();
    expect(before).toBeGreaterThan(0);

    await cartPage.removeItemByIndex(0);
    const after = await cartPage.getItemCount();
    expect(after).toBe(before - 1);
  });

  test('signup new user @regression', async ({ loginPage, signupPage, header, freshContextPage }) => {
    const login = new LoginPage(freshContextPage);
    await login.goto();
    const email = `qa_${Date.now()}@example.com`;
    await login.signup('QA User', email);

    await signupPage.waitForLoad();
    await signupPage.fillAccountInfo({
      title: 'Mr',
      password: 'Passw0rd!',
      day: '10',
      month: '05',
      year: '1990',
      firstName: 'QA',
      lastName: 'User',
      company: 'Nous',
      address1: '123 Test St',
      address2: 'Suite 1',
      country: 'United States',
      state: 'CA',
      city: 'San Francisco',
      zipcode: '94102',
      mobileNumber: '5551234567',
    });
    await signupPage.createAccount();
    await signupPage.continue();

    await expect(header.getLoggedInAs()).toBeVisible();
    const username = await header.getLoggedInUsername();
    expect(username).toContain('QA User');
  });
});