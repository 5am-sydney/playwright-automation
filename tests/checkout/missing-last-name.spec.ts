// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('Missing last name shows error and keeps entered values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Sauce Labs Backpack, open cart, click Checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // 2. Fill First Name 'Jane', Zip '2000', leave Last Name empty; click Continue
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="postalCode"]').fill('2000');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Jane');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('2000');
  });
});
