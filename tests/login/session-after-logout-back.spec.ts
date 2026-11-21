// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Browser back after logout does not restore session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const error = page.locator('[data-test="error"]');
    const guardError = "Epic sadface: You can only access '/inventory.html' when you are logged in.";

    // 1. Fresh page; log in as standard_user; open burger menu; click Logout.
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL(process.env.BASE_URL as string);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // 2. Click browser Back.
    await page.goBack();

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(error).toHaveText(guardError);

    // 3. Click browser Forward / navigate to /inventory.html.
    await page.goto(new URL('/inventory.html', process.env.BASE_URL as string).toString());

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(error).toHaveText(guardError);
  });
});
