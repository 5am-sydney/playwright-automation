// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Empty username shows Username is required', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 1. Fresh page; leave username empty, enter secret_sauce; click Login.
    await loginPage.enterPassword('secret_sauce');
    await loginPage.clickLoginButton();

    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
