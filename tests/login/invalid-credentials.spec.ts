// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Invalid username and password shows mismatch error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 1. Fresh page; enter username 'bad' and password 'bad'; click Login.
    await loginPage.login('bad', 'bad');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL(process.env.BASE_URL as string);
    await expect(page.locator('[data-test="inventory-list"]')).toHaveCount(0);
    await expect(page.locator('[data-test="username"]')).toHaveClass(/error/);
    await expect(page.locator('[data-test="password"]')).toHaveClass(/error/);
  });
});
