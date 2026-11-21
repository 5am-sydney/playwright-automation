// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Shopping Cart', () => {
  test('Add a single item to the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. On the inventory page, confirm no cart badge is shown, then click 'Add to cart' on 'Sauce Labs Backpack'
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveCount(0);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(cartBadge).toHaveText('1');

    // 2. Click the cart icon
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart\.html/);
    const cartItem = page.locator('[data-test="inventory-item"]');
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(cartItem.locator('[data-test="item-quantity"]')).toHaveText('1');
    await expect(cartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  });
});
