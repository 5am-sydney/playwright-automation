// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Sort selection does not alter cart badge or Remove button state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Backpack and Onesie, then change sort to Price (high to low)
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await expect(cartBadge).toHaveText('2');

    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (high to low)');

    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toHaveText('Add to cart');
  });
});
