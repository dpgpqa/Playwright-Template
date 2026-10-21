import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  private readonly emailInput = this.page.getByTestId('login-email');
  private readonly passwordInput = this.page.getByTestId('login-password');
  private readonly submitButton = this.page.getByTestId('login-button');
  private readonly errorMessage = this.page.locator('.login-form .text-danger');
  private readonly signupName = this.page.getByTestId('signup-name');
  private readonly signupEmail = this.page.getByTestId('signup-email');
  private readonly signupButton = this.page.getByTestId('signup-button');
  private readonly loginFormTitle = this.page.locator('.login-form h2');

  async waitForLoad(): Promise<void> {
    await this.loginFormTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWaitForHome(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // Wait for either home page or error message
    await Promise.race([
      this.page.waitForURL('**/', { timeout: 20000 }),
      this.page.waitForURL('**/login', { timeout: 20000 }),
    ]);
  }

  async signup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}