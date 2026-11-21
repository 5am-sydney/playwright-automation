// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('Checkout with empty cart (observed behaviour)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 1. From seed state open cart, click Checkout, fill valid info, Continue
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('2000');
    await page.locator('[data-test="continue"]').click();

    // NOTE: This documents current app behaviour (an app defect): checkout is allowed with an
    // empty cart and the overview shows no items with a $0.00 total.
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $0.00');

    // 2. Click Finish
    await page.locator('[data-test="finish"]').click();

    // NOTE: This documents current app behaviour (an app defect): an order with no items can be completed.
    await expect(page).toHaveURL(/\/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
