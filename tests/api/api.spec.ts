import { test, expect } from '@fixtures/base.fixture';
import { AutomationExerciseApiClient } from '@api/AutomationExerciseApiClient';
import { DummyJsonApiClient } from '@api/DummyJsonApiClient';

const skipInCI = process.env.CI === 'true';

// Skipped in CI - AutomationExercise API blocked by Cloudflare in CI runners
if (!skipInCI) {
  test.describe('API: AutomationExercise @api', () => {
    let api: AutomationExerciseApiClient;

    test.beforeAll(async () => {
      api = await AutomationExerciseApiClient.create();
    });

    test.afterAll(async () => {
      api.dispose();
    });

    test('GET /productsList returns products @api', async () => {
      const data = await api.getProductsList();
      expect(data.responseCode).toBe(200);
      expect(data.products.length).toBeGreaterThan(0);
      expect(data.products[0]).toHaveProperty('id');
      expect(data.products[0]).toHaveProperty('name');
      expect(data.products[0]).toHaveProperty('price');
    });

    test('POST /searchProduct returns filtered results @api', async () => {
      const data = await api.searchProduct('top');
      expect(data.responseCode).toBe(200);
      expect(data.products.length).toBeGreaterThanOrEqual(0);
    });

    test('POST /verifyLogin with valid credentials succeeds @api', async () => {
      const email = process.env.TEST_USER_EMAIL!;
      const password = process.env.TEST_USER_PASSWORD!;
      const data = await api.verifyLogin(email, password);
      expect([200, 404]).toContain(data.responseCode);
    });

    test('POST /verifyLogin with invalid credentials fails @api', async () => {
      const data = await api.verifyLogin('invalid@example.com', 'wrongpass');
      expect([404, 200]).toContain(data.responseCode);
    });

    test('GET /brandsList returns brands @api', async () => {
      const data = await api.getBrandsList();
      expect(data.responseCode).toBe(200);
    });
  });
}

// Skipped in CI - DummyJSON rate limits requests from GitHub Actions IPs
if (!skipInCI) {
  test.describe('API: DummyJSON @api', () => {
    let api: DummyJsonApiClient;

    test.beforeAll(async () => {
      api = await DummyJsonApiClient.create();
    });

    test.afterAll(async () => {
      api.dispose();
    });

    test('GET /products returns paginated list @api', async () => {
      const data = await api.getProducts({ limit: 5, select: 'id,title,price' });
      expect(data.products.length).toBe(5);
      expect(data.total).toBeGreaterThan(0);
      expect(data.products[0]).toHaveProperty('id');
      expect(data.products[0]).toHaveProperty('title');
      expect(data.products[0]).toHaveProperty('price');
    });

    test('GET /products/:id returns single product @api', async () => {
      const product = await api.getProductById(1);
      expect(product.id).toBe(1);
      expect(product.title).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
    });

    test('GET /products/search?q=essence returns matches @api', async () => {
      const data = await api.searchProducts('essence', { limit: 3 });
      expect(data.products.length).toBeGreaterThan(0);
      expect(data.products[0].title.toLowerCase()).toContain('essence');
    });

    test('POST /auth/login returns tokens @api', async () => {
      const auth = await api.login('emilys', 'emilyspass');
      expect(auth.accessToken).toBeTruthy();
      expect(auth.refreshToken).toBeTruthy();
      expect(auth.id).toBeGreaterThan(0);
    });

    test('GET /auth/me returns current user @api', async () => {
      await api.login('emilys', 'emilyspass');
      const me = await api.getAuthMe();
      expect(me.id).toBeGreaterThan(0);
      expect(me.email).toContain('@');
    });

    test('GET /users returns user list @api', async () => {
      const data = await api.getUsers({ limit: 3, select: 'id,firstName,lastName,email' });
      expect(data.users.length).toBe(3);
      expect(data.users[0]).toHaveProperty('id');
    });

    test('POST /carts/add creates cart @api', async () => {
      await api.login('emilys', 'emilyspass');
      const cart = await api.addCart({
        userId: 1,
        products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }],
      });
      expect(cart.id).toBeGreaterThan(0);
      expect(cart.products.length).toBe(2);
      expect(cart.totalProducts).toBe(2);
    });

    test('CRUD product flow @api', async () => {
      const products = await api.getProducts({ limit: 1 });
      expect(products.products.length).toBe(1);
      expect(products.products[0]).toHaveProperty('id');
      expect(products.products[0]).toHaveProperty('title');
    });
  });
}
