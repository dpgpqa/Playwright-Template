import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  protected readonly path = '/products';

  private readonly pageTitle = this.page.getByRole('heading', { name: 'All Products' });
  private readonly productCards = this.page.locator('.product-image-wrapper');
  private readonly searchInput = this.page.locator('#search_product');
  private readonly searchButton = this.page.locator('#submit_search');
  private readonly categorySidebar = this.page.locator('.left-sidebar');
  private readonly brandsSidebar = this.page.locator('.brands_products');

  async waitForLoad(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async addToCartByIndex(index: number): Promise<void> {
    const product = this.productCards.nth(index);
    await product.hover();
    const addButton = product.locator('a.add-to-cart').first();
    await addButton.click();
    const modal = this.page.locator('#cartModal');
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    await modal.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async viewProductByIndex(index: number): Promise<void> {
    const product = this.productCards.nth(index);
    await product.locator('a:has-text("View Product")').first().click();
    await this.page.waitForURL('**/product_details/**', { timeout: 15000 });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(categoryName: string): Promise<void> {
    // Click the main category link to expand accordion
    const categoryLink = this.categorySidebar.locator(`a:has-text("${categoryName}")`).first();
    await categoryLink.click();
    await this.page.waitForTimeout(500);
    // Click the subcategory link (nth(1) skips the main category)
    await this.categorySidebar.locator(`a:has-text("${categoryName}")`).nth(1).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByBrand(brandName: string): Promise<void> {
    await this.brandsSidebar.locator(`a:has-text("${brandName}")`).first().click();
    await this.page.waitForLoadState('networkidle');
  }
}