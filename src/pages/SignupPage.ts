import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  protected readonly path = '/';

  private readonly titleRadios = this.page.locator('input[name="title"]');
  private readonly passwordInput = this.page.locator('#password');
  private readonly daySelect = this.page.locator('#days');
  private readonly monthSelect = this.page.locator('#months');
  private readonly yearSelect = this.page.locator('#years');
  private readonly firstName = this.page.locator('#first_name');
  private readonly lastName = this.page.locator('#last_name');
  private readonly company = this.page.locator('#company');
  private readonly address1 = this.page.locator('#address1');
  private readonly address2 = this.page.locator('#address2');
  private readonly countrySelect = this.page.locator('#country');
  private readonly stateInput = this.page.locator('#state');
  private readonly cityInput = this.page.locator('#city');
  private readonly zipcodeInput = this.page.locator('#zipcode');
  private readonly mobileInput = this.page.locator('#mobile_number');
  private readonly createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
  private readonly accountCreatedMessage = this.page.locator('.text-center h2');
  private readonly continueButton = this.page.getByRole('link', { name: 'Continue' });

  async waitForLoad(): Promise<void> {
    await this.page.locator('h2:has-text("Enter Account Information")').waitFor({ state: 'visible' });
  }

  async fillAccountInfo(data: {
    title: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }): Promise<void> {
    await this.titleRadios.filter({ hasText: data.title }).check();
    await this.passwordInput.fill(data.password);
    await this.daySelect.selectOption(data.day);
    await this.monthSelect.selectOption(data.month);
    await this.yearSelect.selectOption(data.year);
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    if (data.company) await this.company.fill(data.company);
    await this.address1.fill(data.address1);
    if (data.address2) await this.address2.fill(data.address2);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobileNumber);
  }

  async createAccount(): Promise<void> {
    await this.createAccountButton.click();
    await this.accountCreatedMessage.waitFor({ state: 'visible' });
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL('**/');
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.accountCreatedMessage.textContent())?.trim() ?? '';
  }
}