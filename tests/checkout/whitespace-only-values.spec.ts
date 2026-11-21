// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('Whitespace-only values are accepted (observed behaviour)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add item, go to step one, fill each of the three fields with three spaces, click Continue
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    await page.locator('[data-test="firstName"]').fill('   ');
    await page.locator('[data-test="lastName"]').fill('   ');
    await page.locator('[data-test="postalCode"]').fill('   ');
    await page.locator('[data-test="continue"]').click();

    // NOTE: This documents current app behaviour (a known app weakness): whitespace-only
    // values are not trimmed or validated, so the user proceeds to the overview page.
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });
});
