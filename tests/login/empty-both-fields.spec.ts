// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Both fields empty shows Username is required', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 1. Fresh page; click Login without entering anything.
    await loginPage.clickLoginButton();

    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
