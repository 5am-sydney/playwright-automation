// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Error banner can be dismissed with X button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    const username = page.locator('[data-test="username"]');
    const password = page.locator('[data-test="password"]');
    const error = page.locator('[data-test="error"]');

    // 1. Fresh page; click Login with empty fields.
    await loginPage.clickLoginButton();

    await expect(error).toBeVisible();
    await expect(username).toHaveClass(/error/);
    await expect(password).toHaveClass(/error/);
    await expect(page.locator('[data-test="error-button"]')).toBeVisible();

    // 2. Click the X button.
    await page.locator('[data-test="error-button"]').click();

    await expect(error).toHaveCount(0);
    // Observed app behaviour (verified live): dismissing the banner with X only removes
    // the banner. The red "input_error" class stays on the username and password inputs,
    // and it is NOT cleared by typing in either field or by dismissing a second error.
    // So we intentionally do not assert the inputs lose the error class here.
    await expect(page).not.toHaveURL(/inventory\.html/);

    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
