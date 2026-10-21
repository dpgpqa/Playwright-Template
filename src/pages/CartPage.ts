import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  protected readonly path = '/view_cart';

  private readonly cartTable = this.page.locator('#cart_info_table');
  private readonly productRows = this.page.locator('tbody tr');
  private readonly proceedToCheckoutBtn = this.page.locator('.check_out');
  private readonly emptyCartMessage = this.page.locator('#empty_cart p');

  async waitForLoad(): Promise<void> {
    await this.cartTable.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      this.emptyCartMessage.waitFor({ state: 'visible' });
    });
  }

  async getItemCount(): Promise<number> {
    return await this.productRows.count();
  }

  async getItemNames(): Promise<string[]> {
    const names: string[] = [];
    for (const row of await this.productRows.all()) {
      const name = await row.locator('.cart_description h4 a').textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async removeItemByIndex(index: number): Promise<void> {
    const row = this.productRows.nth(index);
    await row.locator('.cart_delete a').click();
    // Wait for row to be removed instead of networkidle
    await this.page.waitForTimeout(1000);
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutBtn.click();
    await this.page.waitForURL('**/checkout', { timeout: 15000 });
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  getCartTable() { return this.cartTable; }
}