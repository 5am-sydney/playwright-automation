// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Checkout Step One (Information)', () => {
  test('Special characters and long values accepted', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add item, go to step one, First with special chars, Last a 100+ character string, Zip with symbols; Continue
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    const longLastName = 'Abcdefghij'.repeat(12); // 120 characters
    await page.locator('[data-test="firstName"]').fill("Zoë-Anne O'Brien-Smith ñ 李");
    await page.locator('[data-test="lastName"]').fill(longLastName);
    await page.locator('[data-test="postalCode"]').fill('SW1A 1AA-@#$%');
    await page.locator('[data-test="continue"]').click();

    // Verified live: 120-character value is accepted with no error
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });
});
