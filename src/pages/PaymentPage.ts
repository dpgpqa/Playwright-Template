import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
  protected readonly path = '/payment';

  private readonly nameOnCard = this.page.locator('[name="name_on_card"]');
  private readonly cardNumber = this.page.locator('[name="card_number"]');
  private readonly cvc = this.page.locator('[name="cvc"]');
  private readonly expiryMonth = this.page.locator('[name="expiry_month"]');
  private readonly expiryYear = this.page.locator('[name="expiry_year"]');
  private readonly payButton = this.page.getByRole('button', { name: 'Pay and Confirm Order' });
  private readonly successMessage = this.page.locator('.alert-success');
  private readonly continueButton = this.page.getByRole('link', { name: 'Continue' });

  async waitForLoad(): Promise<void> {
    await this.nameOnCard.waitFor({ state: 'visible' });
  }

  async fillPayment(data: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.nameOnCard.fill(data.nameOnCard);
    await this.cardNumber.fill(data.cardNumber);
    await this.cvc.fill(data.cvc);
    await this.expiryMonth.fill(data.expiryMonth);
    await this.expiryYear.fill(data.expiryYear);
  }

  async payAndConfirm(): Promise<void> {
    await this.payButton.click();
    await this.successMessage.waitFor({ state: 'visible' });
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent())?.trim() ?? '';
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL('**/');
  }
}