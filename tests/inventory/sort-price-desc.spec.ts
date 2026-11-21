// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Sort Price (high to low) orders prices descending with names paired', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Select 'Price (high to low)'
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (high to low)');

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText([
      '$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99',
    ]);

    const names = page.locator('[data-test="inventory-item-name"]');
    await expect(names.nth(0)).toHaveText('Sauce Labs Fleece Jacket');
    await expect(names.nth(1)).toHaveText('Sauce Labs Backpack');
    // The two $15.99 T-Shirts may appear in either order, so assert them as a set
    const tied = (await Promise.all([names.nth(2).textContent(), names.nth(3).textContent()])).sort();
    expect(tied).toEqual(['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)']);
    await expect(names.nth(4)).toHaveText('Sauce Labs Bike Light');
    await expect(names.nth(5)).toHaveText('Sauce Labs Onesie');
  });
});
