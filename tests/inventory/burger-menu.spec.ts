// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Burger menu opens and closes and lists expected items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const allItems = page.locator('[data-test="inventory-sidebar-link"]');
    const about = page.locator('[data-test="about-sidebar-link"]');
    const logout = page.locator('[data-test="logout-sidebar-link"]');
    const reset = page.locator('[data-test="reset-sidebar-link"]');
    const dynamicCatalog = page.locator('[data-test="dynamic-catalog-sidebar-link"]');

    // The menu is closed initially
    await expect(logout).toBeHidden();

    // 1. Click Open Menu
    await page.locator('#react-burger-menu-btn').click();

    await expect(allItems).toBeVisible();
    await expect(allItems).toHaveText('All Items');
    await expect(about).toBeVisible();
    await expect(about).toHaveAttribute('href', 'https://saucelabs.com/');
    await expect(logout).toBeVisible();
    await expect(reset).toBeVisible();

    // Observed live: 'Dynamic Catalog' is an expandable submenu toggle (aria-expanded), not a navigation link
    await expect(dynamicCatalog).toBeVisible();
    await expect(dynamicCatalog).toHaveAttribute('aria-expanded', 'false');
    await dynamicCatalog.click();
    await expect(dynamicCatalog).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Lazy Load' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Spinner' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Slider' })).toBeVisible();
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Click Close Menu
    // (role-based locator used because clicking the img[data-test="close-menu"] is unreliable)
    await page.getByRole('button', { name: 'Close Menu' }).click();

    await expect(logout).toBeHidden();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);

    // 3. Open menu on a detail page and click All Items
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);

    await page.locator('#react-burger-menu-btn').click();
    await allItems.click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });
});
