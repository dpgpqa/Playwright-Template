import Fastify from 'fastify';

/**
 * Mock HTTP server for API testing
 * Runs as a real HTTP server that Playwright's APIRequestContext can call
 */

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

const dummyProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? 'Essence Mascara' : 'Product ' + (i + 1),
  price: Math.floor(Math.random() * 100) + 10,
  description: i === 0 ? 'Essence mascara for beautiful lashes' : 'Description for product ' + (i + 1),
  category: ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries'][i % 5],
  image: 'https://cdn.dummyjson.com/products/images/' + (i + 1) + '/thumbnail.jpg',
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  stock: Math.floor(Math.random() * 50) + 1,
  brand: ['Apple', 'Samsung', 'Sony', 'Dell', 'HP'][i % 5],
}));

const dummyUsers = [
  { id: 1, firstName: 'Emily', lastName: 'Smith', email: 'emily@test.com', username: 'emilys', password: 'emilyspass' },
  { id: 2, firstName: 'John', lastName: 'Doe', email: 'john@test.com', username: 'johnd', password: 'm38rmF$' },
  { id: 3, firstName: 'Jane', lastName: 'Wilson', email: 'jane@test.com', username: 'janew', password: 'pass123' },
];

const dummyCarts = [
  { id: 1, userId: 1, products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }], total: 150, discountedTotal: 140, totalProducts: 3, totalQuantity: 3 },
];

const authTokens = new Map<string, string>();

function createMockServer() {
  const fastify = Fastify({ logger: false });

  // Universal body parser that handles JSON, form-urlencoded, and text
  fastify.addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'string' }, (req, body, done) => {
    console.log('[MockServer] Form body parser called');
    const bodyStr = typeof body === 'string' ? body : body.toString();
    if (!bodyStr || bodyStr.trim() === '') {
      done(null, {});
      return;
    }
    try {
      const params = new URLSearchParams(bodyStr);
      const result: Record<string, string> = {};
      for (const [key, value] of params) {
        result[key] = value;
      }
      done(null, result);
    } catch {
      done(null, { raw: bodyStr });
    }
  });

  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
      try {
        const bodyStr = typeof body === 'string' ? body : body.toString();
        const parsed = JSON.parse(bodyStr);
        done(null, parsed);
      } catch {
        done(null, { raw: body });
      }
    });

  // Catch-all for other content types
  fastify.addContentTypeParser('*', { parseAs: 'string' }, (req, body, done) => {
    const bodyStr = typeof body === 'string' ? body : body.toString();
    if (!bodyStr || bodyStr.trim() === '') {
      done(null, {});
      return;
    }
    try {
      const parsed = JSON.parse(bodyStr);
      done(null, parsed);
    } catch {
      done(null, { raw: bodyStr });
    }
  });

  // Add request logging
  fastify.addHook('onRequest', async (request) => {
    console.log('[MockServer] ' + request.method + ' ' + request.url + ' (raw: ' + request.raw.url + ')');
  });

  // ============================================
  // AutomationExercise API Mocks
  // Base: /api
  // ============================================

  fastify.get('/api/productsList', async () => {
    console.log('[MockServer] GET /api/productsList hit');
    return { responseCode: 200, products: automationExerciseProducts };
  });

  fastify.post('/api/searchProduct', async (request) => {
    console.log('[MockServer] POST /api/searchProduct hit');
    const body = request.body as { search_product?: string };
    const searchTerm = body.search_product?.toLowerCase() || '';
    const filtered = automationExerciseProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm)
    );
    return { responseCode: 200, products: filtered };
  });

  fastify.post('/api/verifyLogin', async (request) => {
    console.log('[MockServer] POST /api/verifyLogin hit');
    const body = request.body as { email?: string; password?: string };
    const email = body.email;
    const password = body.password;

    if (email === 'qa_bot@example.com' && password === 'Passw0rd!') {
      return { responseCode: 200, message: 'User exists!' };
    }
    return { responseCode: 404, message: 'User not found!' };
  });

  fastify.get('/api/brandsList', async () => {
    console.log('[MockServer] GET /api/brandsList hit');
    return { responseCode: 200, brands: automationExerciseBrands };
  });

  // Add catch-all for AutomationExercise routes without /api prefix
  fastify.get('/productsList', async () => {
    console.log('[MockServer] GET /productsList hit (no /api prefix) - redirecting');
    return { responseCode: 200, products: automationExerciseProducts };
  });

  fastify.post('/searchProduct', async (request, reply) => {
      console.log('[MockServer] POST /searchProduct hit (no /api prefix)');
      console.log('[MockServer] Request body type:', typeof request.body);
      console.log('[MockServer] Request body:', JSON.stringify(request.body));
      const body = request.body as { search_product?: string };
      const searchTerm = body.search_product?.toLowerCase() || '';
      const filtered = automationExerciseProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
      const response = { responseCode: 200, products: filtered };
      console.log('[MockServer] Response:', JSON.stringify(response));
      return response;
    });

    fastify.post('/verifyLogin', async (request, reply) => {
      console.log('[MockServer] POST /verifyLogin hit (no /api prefix)');
      console.log('[MockServer] Request body type:', typeof request.body);
      console.log('[MockServer] Request body:', JSON.stringify(request.body));
      const body = request.body as { email?: string; password?: string };
      const email = body.email;
      const password = body.password;

      if (email === 'qa_bot@example.com' && password === 'Passw0rd!') {
        return { responseCode: 200, message: 'User exists!' };
      }
      return { responseCode: 404, message: 'User not found!' };
    });

  fastify.get('/brandsList', async () => {
      console.log('[MockServer] GET /brandsList hit (no /api prefix)');
      return { responseCode: 200, message: 'OK', brands: automationExerciseBrands };
    });

  // ============================================
  // DummyJSON API Mocks
  // Base: /
  // ============================================

  fastify.get('/products', async (request) => {
    const { limit = '20', skip = '0' } = request.query as { limit?: string; skip?: string };
    const lim = parseInt(limit, 10);
    const sk = parseInt(skip, 10);

    const products = dummyProducts.slice(sk, sk + lim);
    return { products, total: dummyProducts.length, skip: sk, limit: lim };
  });

  fastify.get('/products/:id', async (request) => {
      const id = parseInt((request.params as { id: string }).id, 10);
      const product = dummyProducts.find(p => p.id === id);
      if (!product) {
        return { statusCode: 404, message: 'Product not found' };
      }
      return product;
    });

    fastify.get('/products/search', async (request) => {
    const { q = '', limit = '20' } = request.query as { q?: string; limit?: string };
    const lim = parseInt(limit, 10);
    const query = q.toLowerCase();
    const filtered = dummyProducts.filter(p =>
      p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    ).slice(0, lim);
    return { products: filtered, total: filtered.length, skip: 0, limit: lim };
      });

      fastify.post('/auth/login', async (request) => {
    const body = request.body as { username?: string; password?: string; expiresInMins?: number };
    const user = dummyUsers.find(u => u.username === body.username && u.password === body.password);
    if (!user) {
      return { statusCode: 400, message: 'Invalid credentials' };
    }
    const accessToken = 'mock-access-token-' + Date.now();
    const refreshToken = 'mock-refresh-token-' + Date.now();
    authTokens.set(accessToken, user.id.toString());
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: 'female',
      image: 'https://cdn.dummyjson.com/users/1/photo.jpg',
      accessToken,
      refreshToken,
    };
  });

  fastify.get('/auth/me', async (request) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    const token = auth.slice(7);
    if (!authTokens.has(token)) {
      return { statusCode: 401, message: 'Invalid token' };
    }
    return dummyUsers[0];
      });

      fastify.get('/users', async (request) => {
    const { limit = '20', skip = '0' } = request.query as { limit?: string; skip?: string };
    const lim = parseInt(limit, 10);
    const sk = parseInt(skip, 10);

    const users = dummyUsers.slice(sk, sk + lim);
    return { users, total: dummyUsers.length, skip: sk, limit: lim };
      });

      fastify.post('/carts/add', async (request) => {
          const body = request.body as { userId: number; products: Array<{ id: number; quantity: number }> };
          const productsWithDetails = body.products.map(p => {
            const prod = dummyProducts.find(d => d.id === p.id);
            return {
              id: p.id,
              title: prod?.title || `Product ${p.id}`,
              price: prod?.price || 0,
              quantity: p.quantity,
              total: (prod?.price || 0) * p.quantity,
              discountPercentage: 0,
              discountedPrice: (prod?.price || 0) * p.quantity,
              thumbnail: prod?.image || `https://cdn.dummyjson.com/products/images/${p.id}/thumbnail.jpg`,
            };
          });
          const total = productsWithDetails.reduce((sum, p) => sum + p.total, 0);
          const newCart = {
            id: dummyCarts.length + 1,
            userId: body.userId,
            products: productsWithDetails,
            total,
            discountedTotal: 0,
            totalProducts: body.products.length,
            totalQuantity: body.products.reduce((sum, p) => sum + p.quantity, 0),
          };
          return newCart;
            });

      return fastify;
              }

              let mockServer: Awaited<ReturnType<typeof createMockServer>> | null = null;

              async function startMockServer(port = 3001): Promise<string> {
  if (mockServer) {
    return 'http://localhost:' + port;
  }
  mockServer = await createMockServer();
  await mockServer.listen({ port, host: '0.0.0.0' });
  console.log('[MockServer] Started on http://localhost:' + port);
  return 'http://localhost:' + port;
}

async function stopMockServer(): Promise<void> {
  if (mockServer) {
    await mockServer.close();
    mockServer = null;
    console.log('[MockServer] Stopped');
  }
}

export { startMockServer, stopMockServer };