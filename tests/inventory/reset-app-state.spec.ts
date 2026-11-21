// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Reset App State clears cart badge and resets button states', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Backpack and Bike Light, open menu, click Reset App State
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(cartBadge).toHaveText('2');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="reset-sidebar-link"]').click();

    await expect(cartBadge).toHaveCount(0);

    // 2. Check all buttons (reload page if buttons are stale, and note which)
    // Observed live: right after Reset App State the badge disappears but the inventory buttons are STALE
    // (Backpack and Bike Light still read 'Remove') until the page is reloaded.
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toHaveText('Remove');

    await page.reload();
    await expect(page).toHaveURL(/inventory\.html/);

    await expect(cartBadge).toHaveCount(0);
    const buttons = page.locator('[data-test="inventory-item"] button[data-test^="add-to-cart-"], [data-test="inventory-item"] button[data-test^="remove-"]');
    await expect(buttons).toHaveCount(6);
    await expect(buttons).toHaveText(Array(6).fill('Add to cart'));
    await expect(page.locator('[data-test^="remove-"]')).toHaveCount(0);

    // Cart page is empty
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });
});
