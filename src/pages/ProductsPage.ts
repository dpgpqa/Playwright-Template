import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  protected readonly path = '/products';

  private readonly pageTitle = this.page.getByRole('heading', { name: 'All Products' });
  private readonly productCards = this.page.locator('.product-image-wrapper');
  private readonly searchInput = this.page.getByRole('textbox', { name: 'Search Product' });
  private readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  private readonly categorySidebar = this.page.locator('.left-sidebar');
  private readonly brandsSidebar = this.page.locator('.brands_products');

  async waitForLoad(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible' });
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
    await modal.waitFor({ state: 'visible' });
    await modal.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async viewProductByIndex(index: number): Promise<void> {
    const product = this.productCards.nth(index);
    await product.getByRole('link', { name: 'View Product' }).click();
    await this.page.waitForURL('**/product_details/**');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(categoryName: string): Promise<void> {
    await this.categorySidebar.getByRole('link', { name: categoryName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByBrand(brandName: string): Promise<void> {
    await this.brandsSidebar.getByRole('link', { name: brandName }).click();
    await this.page.waitForLoadState('networkidle');
  }
}