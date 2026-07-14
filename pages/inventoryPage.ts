import { Page } from 'playwright';

export class InventoryPage {
  private page: Page;
  private cartBadge = '.shopping_cart_badge';
  private cartLink = '.shopping_cart_link';
  private sortDropdown = '[data-test="product-sort-container"]';
  private itemName = '.inventory_item_name';
  private itemPrice = '.inventory_item_price';
  private burgerMenuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    this.page = page;
  }

  async addProductToCart(productId: string) {
    await this.page.click(`[data-test="add-to-cart-${productId}"]`);
  }

  async removeProductFromCart(productId: string) {
    await this.page.click(`[data-test="remove-${productId}"]`);
  }

  async getCartCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    if ((await badge.count()) === 0) {
      return 0;
    }
    return parseInt((await badge.innerText()).trim(), 10);
  }

  async goToCart() {
    await this.page.click(this.cartLink);
  }

  async sortBy(optionValue: string) {
    await this.page.selectOption(this.sortDropdown, optionValue);
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.locator(this.itemPrice).allInnerTexts();
    return prices.map((price) => parseFloat(price.replace('$', '')));
  }

  async openFirstProduct(): Promise<string> {
    const first = this.page.locator(this.itemName).first();
    const name = await first.innerText();
    await first.click();
    return name;
  }

  async logout() {
    await this.page.click(this.burgerMenuButton);
    await this.page.click(this.logoutLink);
  }
}
