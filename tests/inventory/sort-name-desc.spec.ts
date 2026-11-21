// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Sort Name (Z to A) reverses order and keeps prices paired', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Select 'Name (Z to A)'
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    await expect(page.locator('[data-test="active-option"]')).toHaveText('Name (Z to A)');
    const cards = page.locator('[data-test="inventory-item"]');
    await expect(cards).toHaveCount(6);

    const expected = [
      ['Test.allTheThings() T-Shirt (Red)', '$15.99'],
      ['Sauce Labs Onesie', '$7.99'],
      ['Sauce Labs Fleece Jacket', '$49.99'],
      ['Sauce Labs Bolt T-Shirt', '$15.99'],
      ['Sauce Labs Bike Light', '$9.99'],
      ['Sauce Labs Backpack', '$29.99'],
    ];
    for (let i = 0; i < expected.length; i++) {
      await expect(cards.nth(i).locator('[data-test="inventory-item-name"]')).toHaveText(expected[i][0]);
      await expect(cards.nth(i).locator('[data-test="inventory-item-price"]')).toHaveText(expected[i][1]);
    }
  });
});
