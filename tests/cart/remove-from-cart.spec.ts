// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Shopping Cart', () => {
  test('Remove an item from the cart page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const cartItems = page.locator('[data-test="inventory-item"]');
    const itemNames = page.locator('[data-test="inventory-item-name"]');

    // 1. Add 'Sauce Labs Backpack' and 'Sauce Labs Onesie', open cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(cartItems).toHaveCount(2);
    await expect(itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
    await expect(cartBadge).toHaveText('2');

    // 2. Remove Backpack
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(cartItems).toHaveCount(1);
    await expect(itemNames).toHaveText(['Sauce Labs Onesie']);
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveCount(0);
    await expect(cartBadge).toHaveText('1');

    // 3. Remove Onesie
    await page.locator('[data-test="remove-sauce-labs-onesie"]').click();

    await expect(cartItems).toHaveCount(0);
    await expect(cartBadge).toHaveCount(0);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});
