// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Empty password shows Password is required', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 1. Fresh page; enter standard_user, leave password empty; click Login.
    await loginPage.enterUsername('standard_user');
    await loginPage.clickLoginButton();

    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
