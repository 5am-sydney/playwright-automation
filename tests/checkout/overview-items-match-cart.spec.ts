// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step Two (Overview)', () => {
  test('Overview lists items, quantities and prices matching the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Backpack ($29.99) and Bike Light ($9.99), record cart names/prices, complete step one
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    const cartItems = page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(2);
    const cartNames = await cartItems.locator('[data-test="inventory-item-name"]').allTextContents();
    const cartPrices = await cartItems.locator('[data-test="inventory-item-price"]').allTextContents();
    expect(cartNames).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    expect(cartPrices).toEqual(['$29.99', '$9.99']);

    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('2000');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    const overviewItems = page.locator('[data-test="checkout-summary-container"] [data-test="inventory-item"]');
    await expect(overviewItems).toHaveCount(2);
    await expect(overviewItems.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
    await expect(overviewItems.locator('[data-test="inventory-item-name"]')).toHaveText(cartNames);
    await expect(overviewItems.locator('[data-test="inventory-item-price"]')).toHaveText(cartPrices);
  });
});
