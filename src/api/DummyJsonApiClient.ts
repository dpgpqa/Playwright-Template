import { APIRequestContext, request as pwRequest } from '@playwright/test';
import { ProductsListSchema, ProductSchema, UsersListSchema, UserSchema, AuthLoginSchema, CartSchema, type ProductsList, type Product, type UsersList, type User, type AuthLogin, type Cart } from './dummyJsonApi';

export class DummyJsonApiClient {
  private authToken?: string;

  constructor(
    private readonly api: APIRequestContext,
    private readonly baseURL: string = process.env.DUMMYJSON_BASE_URL || 'https://dummyjson.com'
  ) {}

  static async create(apiContext?: APIRequestContext): Promise<DummyJsonApiClient> {
    const api = apiContext ?? await pwRequest.newContext({ 
      baseURL: process.env.DUMMYJSON_BASE_URL || 'https://dummyjson.com',
      extraHTTPHeaders: { 'Accept': 'application/json' },
    });
    return new DummyJsonApiClient(api);
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) h['Authorization'] = `Bearer ${this.authToken}`;
    return h;
  }

  async getProducts(params?: { limit?: number; skip?: number; select?: string }): Promise<ProductsList> {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.skip) search.set('skip', String(params.skip));
    if (params?.select) search.set('select', params.select);
    const res = await this.api.get(`/products?${search.toString()}`, { headers: this.headers() });
    const data = await res.json();
    return ProductsListSchema.parse(data);
  }

  async getProductById(id: number): Promise<Product> {
    const res = await this.api.get(`/products/${id}`, { headers: this.headers() });
    const data = await res.json();
    return ProductSchema.parse(data);
  }

  async searchProducts(query: string, params?: { limit?: number; select?: string }): Promise<ProductsList> {
    const search = new URLSearchParams({ q: query });
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.select) search.set('select', params.select);
    const res = await this.api.get(`/products/search?${search.toString()}`, { headers: this.headers() });
    const data = await res.json();
    return ProductsListSchema.parse(data);
  }

  async addProduct(product: { title: string; price: number; category: string }): Promise<Product> {
    const res = await this.api.post('/products/add', { data: product, headers: this.headers() });
    const data = await res.json();
    return ProductSchema.parse(data);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const res = await this.api.put(`/products/${id}`, { data: product, headers: this.headers() });
    const data = await res.json();
    return ProductSchema.parse(data);
  }

  async deleteProduct(id: number): Promise<Product> {
    const res = await this.api.delete(`/products/${id}`, { headers: this.headers() });
    const data = await res.json();
    return ProductSchema.parse(data);
  }

  async login(username: string, password: string, expiresInMins = 60): Promise<AuthLogin> {
    const res = await this.api.post('/auth/login', {
      data: { username, password, expiresInMins },
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    const parsed = AuthLoginSchema.parse(data);
    this.setAuthToken(parsed.accessToken);
    return parsed;
  }

  async getAuthMe(): Promise<User> {
    const res = await this.api.get('/auth/me', { headers: this.headers() });
    const data = await res.json();
    return UserSchema.parse(data);
  }

  async getUsers(params?: { limit?: number; skip?: number; select?: string }): Promise<UsersList> {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.skip) search.set('skip', String(params.skip));
    if (params?.select) search.set('select', params.select);
    const res = await this.api.get(`/users?${search.toString()}`, { headers: this.headers() });
    const data = await res.json();
    return UsersListSchema.parse(data);
  }

  async getUserById(id: number, select?: string): Promise<User> {
    const search = select ? `?select=${select}` : '';
    const res = await this.api.get(`/users/${id}${search}`, { headers: this.headers() });
    const data = await res.json();
    return UserSchema.parse(data);
  }

  async addCart(cart: { userId: number; products: Array<{ id: number; quantity: number }> }): Promise<Cart> {
    const res = await this.api.post('/carts/add', { data: cart, headers: this.headers() });
    const data = await res.json();
    return CartSchema.parse(data);
  }

  dispose(): void {
    this.api.dispose();
  }
}