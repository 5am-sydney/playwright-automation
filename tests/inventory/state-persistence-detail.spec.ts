// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Add/remove state persists after opening a detail page and returning', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // 1. Add Backpack on inventory, open Bike Light detail, return via Back to products
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(cartBadge).toHaveText('1');

    await page.locator('[data-test="item-0-title-link"]').click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=0/);
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toHaveText('Add to cart');
    await expect(cartBadge).toHaveText('1');

    // 2. Open Backpack detail
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
    await expect(page.locator('[data-test="remove"]')).toHaveText('Remove');

    // 3. Click Remove on detail, go back
    await page.locator('[data-test="remove"]').click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');
    await expect(cartBadge).toHaveCount(0);
  });
});
