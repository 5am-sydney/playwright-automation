// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Shopping Cart', () => {
  test('Continue Shopping preserves cart state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const continueShopping = page.locator('[data-test="continue-shopping"]');
    const itemNames = page.locator('[data-test="inventory-item-name"]');

    // 1. Add 'Sauce Labs Fleece Jacket', open cart
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(itemNames).toHaveText(['Sauce Labs Fleece Jacket']);

    // 2. Click 'Continue Shopping'
    await continueShopping.click();

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(cartBadge).toHaveText('1');
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toHaveText('Remove');

    // 3. Add 'Test.allTheThings() T-Shirt (Red)', reopen cart
    await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(itemNames).toHaveText(['Sauce Labs Fleece Jacket', 'Test.allTheThings() T-Shirt (Red)']);
    await expect(cartBadge).toHaveText('2');

    // 4. Remove all items from cart, click 'Continue Shopping'
    await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await continueShopping.click();

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(cartBadge).toHaveCount(0);
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });
});
