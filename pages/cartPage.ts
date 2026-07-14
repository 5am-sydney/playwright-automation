import { Page } from 'playwright';

export class CartPage {
  private page: Page;
  private cartItem = '.cart_item';
  private itemName = '.inventory_item_name';
  private checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    this.page = page;
  }

  async getItemCount(): Promise<number> {
    return this.page.locator(this.cartItem).count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator(this.itemName).allInnerTexts();
  }

  async checkout() {
    await this.page.click(this.checkoutButton);
  }
}
