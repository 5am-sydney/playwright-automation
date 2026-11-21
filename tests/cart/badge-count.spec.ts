// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Shopping Cart', () => {
  test('Cart badge count tracks multiple adds and removes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // 1. Add 'Sauce Labs Backpack', 'Sauce Labs Bike Light' and 'Sauce Labs Bolt T-Shirt' from inventory
    await expect(cartBadge).toHaveCount(0);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(cartBadge).toHaveText('1');

    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(cartBadge).toHaveText('2');

    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await expect(cartBadge).toHaveText('3');

    // 2. Click 'Remove' on Bike Light on inventory
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toHaveText('Add to cart');

    // 3. Remove remaining two items
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(cartBadge).toHaveText('1');
    await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
    await expect(cartBadge).toHaveCount(0);
  });
});
