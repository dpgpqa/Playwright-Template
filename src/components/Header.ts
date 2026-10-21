import { Page, Locator } from '@playwright/test';

export class Header {
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly deleteAccountLink: Locator;
  private readonly loggedInAs: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.loginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.loggedInAs = page.locator('li:has-text("Logged in as")');
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

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await this.page.waitForURL('**/delete_account');
  }

  async isLoggedIn(username?: string): Promise<boolean> {
    await this.loggedInAs.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (username) {
      return (await this.loggedInAs.textContent())?.includes(username) ?? false;
    }
    return await this.loggedInAs.isVisible();
  }

  async getLoggedInUsername(): Promise<string | null> {
    const text = await this.loggedInAs.textContent();
    return text?.replace('Logged in as ', '').trim() ?? null;
  }

  getLoggedInAs() { return this.loggedInAs; }
}