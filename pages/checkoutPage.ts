import { Page } from 'playwright';

export class CheckoutPage {
  private page: Page;
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';
  private finishButton = '[data-test="finish"]';

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
}
