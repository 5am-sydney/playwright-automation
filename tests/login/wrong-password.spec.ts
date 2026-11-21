// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Valid username with wrong password shows mismatch error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 1. Fresh page; enter standard_user and password 'wrong'; click Login.
    await loginPage.login('standard_user', 'wrong');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
