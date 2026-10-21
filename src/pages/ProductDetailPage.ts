import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  protected readonly path = '/product_details/';

  private readonly productName = this.page.locator('.product-information h2');
  private readonly productPrice = this.page.locator('.product-information span span');
  private readonly quantityInput = this.page.getByTestId('quantity');
  private readonly addToCartButton = this.page.getByRole('button', { name: 'Add to cart' });
  private readonly continueShoppingButton = this.page.getByRole('button', { name: 'Continue Shopping' });
  private readonly viewCartButton = this.page.getByRole('link', { name: 'View Cart' });

  async waitForLoad(): Promise<void> {
    await this.productName.waitFor({ state: 'visible' });
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent())?.trim() ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent())?.trim() ?? '';
  }

  async setQuantity(qty: number): Promise<void> {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    const modal = this.page.locator('#cartModal');
    await modal.waitFor({ state: 'visible' });
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async goToCart(): Promise<void> {
    const modal = this.page.locator('#cartModal');
    await modal.waitFor({ state: 'visible' });
    await this.viewCartButton.click();
    await this.page.waitForURL('**/view_cart');
  }
}