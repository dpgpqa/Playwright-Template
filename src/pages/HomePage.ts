import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  protected readonly path = '/';

  private readonly header = this.page.locator('header');
  private readonly productsLink = this.page.getByRole('link', { name: 'Products' });
  private readonly cartLink = this.page.getByRole('link', { name: 'Cart' });
  private readonly loginLink = this.page.getByRole('link', { name: 'Signup / Login' });
  private readonly logoutLink = this.page.getByRole('link', { name: 'Logout' });
  private readonly deleteAccountLink = this.page.getByRole('link', { name: 'Delete Account' });
  private readonly loggedInAs = this.page.locator('li:has-text("Logged in as")');

  async waitForLoad(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
    await this.page.waitForURL('**/products');
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/view_cart');
  }

  async goToLogin(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForURL('**/login');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL('**/');
  }

  async isLoggedIn(username?: string): Promise<boolean> {
    await this.loggedInAs.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (username) {
      return (await this.loggedInAs.textContent())?.includes(username) ?? false;
    }
    return await this.loggedInAs.isVisible();
  }

  getProductsLink() { return this.productsLink; }
  getLoggedInAs() { return this.loggedInAs; }
}