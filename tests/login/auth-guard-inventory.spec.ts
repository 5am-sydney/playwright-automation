// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Direct access to /inventory.html without login is blocked', async ({ page }) => {
    // 1. In a fresh context navigate directly to BASE_URL/inventory.html.
    await page.goto(new URL('/inventory.html', process.env.BASE_URL as string).toString());

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });
});
