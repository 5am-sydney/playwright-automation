import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

test.describe('Inventory Tests', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should add a single product to the cart', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('should add multiple products to the cart', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');

    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('should remove a product from the cart', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeProductFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('should sort products by price from low to high', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sortedAscending = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedAscending);
  });

  test('should open the product detail page', async ({ page }) => {
    const productName = await inventoryPage.openFirstProduct();

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(productName);
  });

  test('should log out and return to the login page', async ({ page }) => {
    await inventoryPage.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
  });
});
