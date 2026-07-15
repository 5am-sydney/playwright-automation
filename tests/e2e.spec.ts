import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';

test.describe('E2E Business Critical Journeys', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  // 1. The order total shown to the customer must be arithmetically correct.
  test('single-product purchase: grand total equals item total plus tax', async ({ page }) => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();

    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  // 2. A multi-item order must carry every item through, and the subtotal must sum correctly.
  test('multi-item purchase: all items reach checkout and subtotal equals their sum', async ({ page }) => {
    const products = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    expect(await inventoryPage.getCartCount()).toBe(products.length);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(products.length);

    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();

    const prices = await checkoutPage.getItemPrices();
    expect(prices).toHaveLength(products.length);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    expect(await checkoutPage.getItemTotal()).toBeCloseTo(sum, 2);

    await checkoutPage.finish();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  // 3. A price-conscious customer sorts by price, buys the cheapest item, and checks out.
  test('shop-by-lowest-price: sort, buy the cheapest item, and complete the order', async ({ page }) => {
    await inventoryPage.sortBy('lohi');
    const cheapest = Math.min(...(await inventoryPage.getProductPrices()));

    const addedName = await inventoryPage.addFirstProductToCart();
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemNames()).toContain(addedName);

    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();
    expect((await checkoutPage.getItemPrices())[0]).toBeCloseTo(cheapest, 2);

    await checkoutPage.finish();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  // 4. A customer changes their mind, removes an item in the cart, and buys the rest.
  test('edit cart mid-journey: remove one item then purchase the remaining item', async ({ page }) => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.goToCart();
    await cartPage.removeItem('sauce-labs-backpack');
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await inventoryPage.getCartCount()).toBe(1);
    expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Bike Light']);

    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  // 5. Interrupted shopping: add an item, go back to browse, add another, then buy both.
  test('interrupted shopping: continue shopping, add more, then check out everything', async ({ page }) => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
    await inventoryPage.addProductToCart('sauce-labs-onesie');
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
