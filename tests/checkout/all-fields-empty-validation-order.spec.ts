// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('All fields empty shows First Name error (validation order)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add item, go to step one, click Continue with all empty
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    // 2. Fill First Name only, Continue
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');

    // 3. Fill Last Name, Continue
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });
});
