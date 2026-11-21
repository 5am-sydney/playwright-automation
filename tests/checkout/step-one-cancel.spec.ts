// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('Cancel on step one returns to cart with items intact', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Backpack and Bike Light, open cart, Checkout, click Cancel
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL(/\/cart\.html/);
    // The checkout button exists only on the cart page
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    const cartItems = page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });
});
