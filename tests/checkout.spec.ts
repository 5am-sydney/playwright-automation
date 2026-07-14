import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';

test.describe('Checkout Tests', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
  });

  test('should complete the checkout flow for a purchased item', async ({ page }) => {
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.checkout();
    await checkoutPage.fillInformation('Alok', 'Sharma', '2000');
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('should show an error when the first name is missing at checkout', async ({ page }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('', 'Sharma', '2000');
    await checkoutPage.continue();

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });
});
