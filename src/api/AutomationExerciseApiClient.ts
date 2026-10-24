import { APIRequestContext, request as pwRequest } from '@playwright/test';
import { ProductsListSchema, ProductSchema, APIResponseSchema, type ProductsList, type Product, type APIResponse } from './automationExerciseApi';

export class AutomationExerciseApiClient {
  constructor(
    private readonly api: APIRequestContext,
    private readonly baseURL: string = process.env.AUTOMATION_EXERCISE_API_BASE || 'https://automationexercise.com/api'
  ) {}

  static async create(apiContext?: APIRequestContext): Promise<AutomationExerciseApiClient> {
    const api = apiContext ?? await pwRequest.newContext({ 
      baseURL: process.env.AUTOMATION_EXERCISE_API_BASE || 'https://automationexercise.com/api',
      extraHTTPHeaders: { 'Accept': 'application/json' },
    });
    return new AutomationExerciseApiClient(api);
  }

  async getProductsList(): Promise<ProductsList> {
    const res = await this.api.get('/productsList');
    const data = await res.json();
    return ProductsListSchema.parse(data);
  }

  async searchProduct(searchTerm: string): Promise<ProductsList> {
    const res = await this.api.post('/searchProduct', { form: { search_product: searchTerm } });
    const data = await res.json();
    return ProductsListSchema.parse(data);
  }

  async createAccount(userData: Record<string, string>): Promise<APIResponse> {
    const res = await this.api.post('/createAccount', { form: userData });
    const data = await res.json();
    return APIResponseSchema.parse(data);
  }

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    const res = await this.api.post('/verifyLogin', { form: { email, password } });
    const data = await res.json();
    return APIResponseSchema.parse(data);
  }

  async deleteAccount(email: string, password: string): Promise<APIResponse> {
    const res = await this.api.delete('/deleteAccount', { form: { email, password } });
    const data = await res.json();
    return APIResponseSchema.parse(data);
  }

  async getBrandsList(): Promise<APIResponse> {
    const res = await this.api.get('/brandsList');
    const data = await res.json();
    return APIResponseSchema.parse(data);
  }

  dispose(): void {
    this.api.dispose();
  }
}