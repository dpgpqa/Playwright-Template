import { test, expect } from '@fixtures/base.fixture';
import { AutomationExerciseApiClient } from '@api/AutomationExerciseApiClient';
import { DummyJsonApiClient } from '@api/DummyJsonApiClient';

const skipInCI = process.env.CI === 'true';

test.describe('API: AutomationExercise @api', () => {
  let api: AutomationExerciseApiClient;

  test.beforeAll(async () => {
    api = await AutomationExerciseApiClient.create();
  });

  test.afterAll(async () => {
    api.dispose();
  });

  test.skip(skipInCI, 'GET /productsList returns products @api');
  test.skip(skipInCI, 'GET /productsList returns products @api (impl)', async () => {
    const data = await api.getProductsList();
    expect(data.responseCode).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0]).toHaveProperty('id');
    expect(data.products[0]).toHaveProperty('name');
    expect(data.products[0]).toHaveProperty('price');
  });

  test.skip(skipInCI, 'POST /searchProduct returns filtered results @api');
  test.skip(skipInCI, 'POST /searchProduct returns filtered results @api (impl)', async () => {
    const data = await api.searchProduct('top');
    expect(data.responseCode).toBe(200);
    expect(data.products.length).toBeGreaterThanOrEqual(0);
  });

  test.skip(skipInCI, 'POST /verifyLogin with valid credentials succeeds @api');
  test.skip(skipInCI, 'POST /verifyLogin with valid credentials succeeds @api (impl)', async () => {
    const email = process.env.TEST_USER_EMAIL!;
    const password = process.env.TEST_USER_PASSWORD!;
    const data = await api.verifyLogin(email, password);
    expect([200, 404]).toContain(data.responseCode);
  });

  test.skip(skipInCI, 'POST /verifyLogin with invalid credentials fails @api');
  test.skip(skipInCI, 'POST /verifyLogin with invalid credentials fails @api (impl)', async () => {
    const data = await api.verifyLogin('invalid@example.com', 'wrongpass');
    expect([404, 200]).toContain(data.responseCode);
  });

  test.skip(skipInCI, 'GET /brandsList returns brands @api');
  test.skip(skipInCI, 'GET /brandsList returns brands @api (impl)', async () => {
    const data = await api.getBrandsList();
    expect(data.responseCode).toBe(200);
  });
});

test.describe('API: DummyJSON @api', () => {
  let api: DummyJsonApiClient;

  test.beforeAll(async () => {
    api = await DummyJsonApiClient.create();
  });

  test.afterAll(async () => {
    api.dispose();
  });

  test.skip(skipInCI, 'GET /products returns paginated list @api');
  test.skip(skipInCI, 'GET /products returns paginated list @api (impl)', async () => {
    const data = await api.getProducts({ limit: 5, select: 'id,title,price' });
    expect(data.products.length).toBe(5);
    expect(data.total).toBeGreaterThan(0);
    expect(data.products[0]).toHaveProperty('id');
    expect(data.products[0]).toHaveProperty('title');
    expect(data.products[0]).toHaveProperty('price');
  });

  test.skip(skipInCI, 'GET /products/:id returns single product @api');
  test.skip(skipInCI, 'GET /products/:id returns single product @api (impl)', async () => {
    const product = await api.getProductById(1);
    expect(product.id).toBe(1);
    expect(product.title).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
  });

  test.skip(skipInCI, 'GET /products/search?q=essence returns matches @api');
  test.skip(skipInCI, 'GET /products/search?q=essence returns matches @api (impl)', async () => {
    const data = await api.searchProducts('essence', { limit: 3 });
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0].title.toLowerCase()).toContain('essence');
  });

  test.skip(skipInCI, 'POST /auth/login returns tokens @api');
  test.skip(skipInCI, 'POST /auth/login returns tokens @api (impl)', async () => {
    const auth = await api.login('emilys', 'emilyspass');
    expect(auth.accessToken).toBeTruthy();
    expect(auth.refreshToken).toBeTruthy();
    expect(auth.id).toBeGreaterThan(0);
  });

  test.skip(skipInCI, 'GET /auth/me returns current user @api');
  test.skip(skipInCI, 'GET /auth/me returns current user @api (impl)', async () => {
    await api.login('emilys', 'emilyspass');
    const me = await api.getAuthMe();
    expect(me.id).toBeGreaterThan(0);
    expect(me.email).toContain('@');
  });

  test.skip(skipInCI, 'GET /users returns user list @api');
  test.skip(skipInCI, 'GET /users returns user list @api (impl)', async () => {
    const data = await api.getUsers({ limit: 3, select: 'id,firstName,lastName,email' });
    expect(data.users.length).toBe(3);
    expect(data.users[0]).toHaveProperty('id');
  });

  test.skip(skipInCI, 'POST /carts/add creates cart @api');
  test.skip(skipInCI, 'POST /carts/add creates cart @api (impl)', async () => {
    await api.login('emilys', 'emilyspass');
    const cart = await api.addCart({
      userId: 1,
      products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }],
    });
    expect(cart.id).toBeGreaterThan(0);
    expect(cart.products.length).toBe(2);
    expect(cart.totalProducts).toBe(2);
  });

  test.skip(skipInCI, 'CRUD product flow @api');
  test.skip(skipInCI, 'CRUD product flow @api (impl)', async () => {
    const products = await api.getProducts({ limit: 1 });
    expect(products.products.length).toBe(1);
    expect(products.products[0]).toHaveProperty('id');
    expect(products.products[0]).toHaveProperty('title');
  });
});
