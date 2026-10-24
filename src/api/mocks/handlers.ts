import { http, HttpResponse, delay } from 'msw';

/**
 * MSW Handlers for API Mocking
 * Simulates AutomationExercise.com and DummyJSON APIs
 */

// ============================================
// AutomationExercise API Mocks
// Base: https://automationexercise.com/api
// ============================================

const automationExerciseProducts = [
  { id: 1, name: 'Blue Top', price: 'Rs. 500', brand: 'Polo', category: { usertype: { usertype: 'Women' }, category: 'Tops' } },
  { id: 2, name: 'Men Tshirt', price: 'Rs. 400', brand: 'H&M', category: { usertype: { usertype: 'Men' }, category: 'Tshirts' } },
  { id: 3, name: 'Sleeveless Dress', price: 'Rs. 600', brand: 'Madame', category: { usertype: { usertype: 'Women' }, category: 'Dresses' } },
  { id: 4, name: 'Stylish Dress', price: 'Rs. 800', brand: 'Mast & Harbour', category: { usertype: { usertype: 'Women' }, category: 'Dresses' } },
  { id: 5, name: 'Winter Top', price: 'Rs. 700', brand: 'Kookie Kids', category: { usertype: { usertype: 'Women' }, category: 'Tops' } },
];

const automationExerciseBrands = [
  { id: 1, brand: 'Polo' },
  { id: 2, brand: 'H&M' },
  { id: 3, brand: 'Madame' },
  { id: 4, brand: 'Mast & Harbour' },
  { id: 5, brand: 'Kookie Kids' },
];

const automationExerciseHandlers = [
  // GET /productsList
  http.get('https://automationexercise.com/api/productsList', async () => {
    await delay(100);
    return HttpResponse.json({
      responseCode: 200,
      products: automationExerciseProducts,
    });
  }),

  // POST /searchProduct
  http.post('https://automationexercise.com/api/searchProduct', async ({ request }) => {
    await delay(100);
    const formData = await request.formData();
    const searchTerm = formData.get('search_product')?.toString().toLowerCase() || '';
    const filtered = automationExerciseProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm)
    );
    return HttpResponse.json({
      responseCode: 200,
      products: filtered,
    });
  }),

  // POST /verifyLogin - valid credentials
  http.post('https://automationexercise.com/api/verifyLogin', async ({ request }) => {
    await delay(150);
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    // Valid test credentials
    if (email === 'qa_bot@example.com' && password === 'Passw0rd!') {
      return HttpResponse.json({
        responseCode: 200,
        message: 'User exists!',
      });
    }
    // Invalid credentials
    return HttpResponse.json({
      responseCode: 404,
      message: 'User not found!',
    });
  }),

  // GET /brandsList
  http.get('https://automationexercise.com/api/brandsList', async () => {
    await delay(100);
    return HttpResponse.json({
      responseCode: 200,
      brands: automationExerciseBrands,
    });
  }),
];

// ============================================
// DummyJSON API Mocks
// Base: https://dummyjson.com
// ============================================

const dummyProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 10,
  description: `Description for product ${i + 1}`,
  category: ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries'][i % 5],
  image: `https://cdn.dummyjson.com/products/images/${i + 1}/thumbnail.jpg`,
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  stock: Math.floor(Math.random() * 50) + 1,
  brand: ['Apple', 'Samsung', 'Sony', 'Dell', 'HP'][i % 5],
}));

const dummyUsers = [
  { id: 1, firstName: 'Emily', lastName: 'Smith', email: 'emily@test.com', username: 'emilys', password: 'emilyspass' },
  { id: 2, firstName: 'John', lastName: 'Doe', email: 'john@test.com', username: 'johnd', password: 'm38rmF$' },
];

const dummyCarts = [
  { id: 1, userId: 1, products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }], total: 150, discountedTotal: 140, totalProducts: 3, totalQuantity: 3 },
];

const dummyJSONHandlers = [
  // GET /products
  http.get('https://dummyjson.com/products', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = parseInt(url.searchParams.get('skip') || '0', 10);
    // const select = url.searchParams.get('select')?.split(',') || []; // Ignored for simplicity

    const products = dummyProducts.slice(skip, skip + limit);
    return HttpResponse.json({
      products,
      total: dummyProducts.length,
      skip,
      limit,
    });
  }),

  // GET /products/:id
  http.get('https://dummyjson.com/products/:id', async ({ params }) => {
    await delay(100);
    const id = parseInt(params.id as string, 10);
    const product = dummyProducts.find(p => p.id === id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  // GET /products/search
  http.get('https://dummyjson.com/products/search', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() || '';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const filtered = dummyProducts.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, limit);
    return HttpResponse.json({
      products: filtered,
      total: filtered.length,
      skip: 0,
      limit,
    });
  }),

  // POST /auth/login
  http.post('https://dummyjson.com/auth/login', async ({ request }) => {
    await delay(150);
    const body = await request.json() as { username?: string; password?: string };
    const user = dummyUsers.find(u => u.username === body.username && u.password === body.password);
    if (!user) {
      return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
    }
    return HttpResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: 'female',
      image: 'https://cdn.dummyjson.com/users/1/photo.jpg',
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    });
  }),

  // GET /auth/me
  http.get('https://dummyjson.com/auth/me', async ({ request }) => {
    await delay(100);
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    // Return first user for any valid token
    return HttpResponse.json(dummyUsers[0]);
  }),

  // GET /users
  http.get('https://dummyjson.com/users', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = parseInt(url.searchParams.get('skip') || '0', 10);
    // const select = url.searchParams.get('select')?.split(',') || []; // Ignored for simplicity

    const users = dummyUsers.slice(skip, skip + limit);
    return HttpResponse.json({
      users,
      total: dummyUsers.length,
      skip,
      limit,
    });
  }),

  // POST /carts/add
  http.post('https://dummyjson.com/carts/add', async ({ request }) => {
    await delay(150);
    const body = await request.json() as { userId: number; products: Array<{ id: number; quantity: number }> };
    const newCart = {
      id: dummyCarts.length + 1,
      userId: body.userId,
      products: body.products,
      total: body.products.reduce((sum, p) => {
        const prod = dummyProducts.find(d => d.id === p.id);
        return sum + (prod?.price || 0) * p.quantity;
      }, 0),
      discountedTotal: 0,
      totalProducts: body.products.length,
      totalQuantity: body.products.reduce((sum, p) => sum + p.quantity, 0),
    };
    return HttpResponse.json(newCart);
  }),
];

// ============================================
// Combined handlers
// ============================================

export const handlers = [...automationExerciseHandlers, ...dummyJSONHandlers];