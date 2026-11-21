// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Add and remove from detail page syncs the cart badge', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Open Backpack detail, click 'Add to cart'
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
    await expect(cartBadge).toHaveCount(0);

    await page.locator('[data-test="add-to-cart"]').click();

    await expect(page.locator('[data-test="remove"]')).toHaveText('Remove');
    await expect(cartBadge).toHaveText('1');

    // 2. Click 'Remove'
    await page.locator('[data-test="remove"]').click();

    await expect(page.locator('[data-test="add-to-cart"]')).toHaveText('Add to cart');
    await expect(cartBadge).toHaveCount(0);
  });
});
