import { Page } from 'playwright';

export class CheckoutPage {
  private page: Page;
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';
  private finishButton = '[data-test="finish"]';
  private itemPrice = '.inventory_item_price';
  private itemName = '.inventory_item_name';
  private subtotalLabel = '[data-test="subtotal-label"]';
  private taxLabel = '[data-test="tax-label"]';
  private totalLabel = '[data-test="total-label"]';

  constructor(page: Page) {
    this.page = page;
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    if (firstName) {
      await this.page.fill(this.firstNameInput, firstName);
    }
    if (lastName) {
      await this.page.fill(this.lastNameInput, lastName);
    }
    if (postalCode) {
      await this.page.fill(this.postalCodeInput, postalCode);
    }
  }

  async continue() {
    await this.page.click(this.continueButton);
  }

  async finish() {
    await this.page.click(this.finishButton);
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator(this.itemName).allInnerTexts();
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.page.locator(this.itemPrice).allInnerTexts();
    return prices.map((price) => parseFloat(price.replace('$', '')));
  }

  async getItemTotal(): Promise<number> {
    return this.parseCurrency(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.parseCurrency(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.parseCurrency(this.totalLabel);
  }

  private async parseCurrency(selector: string): Promise<number> {
    const text = await this.page.locator(selector).innerText();
    const match = text.match(/\$(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : NaN;
  }
}
