import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout';

  private readonly addressFirstName = this.page.locator('#address_first_name');
  private readonly addressLastName = this.page.locator('#address_last_name');
  private readonly addressCompany = this.page.locator('#address_company');
  private readonly address1 = this.page.locator('#address_address1');
  private readonly address2 = this.page.locator('#address_address2');
  private readonly addressCountry = this.page.locator('#address_country');
  private readonly addressState = this.page.locator('#address_state');
  private readonly addressCity = this.page.locator('#address_city');
  private readonly addressZip = this.page.locator('#address_zipcode');
  private readonly addressPhone = this.page.locator('#address_phone_number');
  private readonly placeOrderButton = this.page.getByRole('link', { name: 'Place Order' });
  private readonly commentInput = this.page.locator('textarea[name="message"]');

  async waitForLoad(): Promise<void> {
    await this.addressFirstName.waitFor({ state: 'visible' });
  }

  async fillAddress(data: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    phone: string;
  }): Promise<void> {
    await this.addressFirstName.fill(data.firstName);
    await this.addressLastName.fill(data.lastName);
    if (data.company) await this.addressCompany.fill(data.company);
    await this.address1.fill(data.address1);
    if (data.address2) await this.address2.fill(data.address2);
    await this.addressCountry.selectOption(data.country);
    await this.addressState.fill(data.state);
    await this.addressCity.fill(data.city);
    await this.addressZip.fill(data.zip);
    await this.addressPhone.fill(data.phone);
  }

  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.page.waitForURL('**/payment');
  }
}