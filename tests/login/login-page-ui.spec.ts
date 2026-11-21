// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Login page UI elements', async ({ page }) => {
    // 1. Open BASE_URL in a fresh context (no login).
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');

    // 2. Inspect form controls.
    const username = page.locator('[data-test="username"]');
    const password = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');

    await expect(username).toBeVisible();
    await expect(username).toHaveAttribute('placeholder', 'Username');
    await expect(username).toHaveValue('');

    await expect(password).toBeVisible();
    await expect(password).toHaveAttribute('placeholder', 'Password');
    await expect(password).toHaveValue('');
    await expect(password).toHaveAttribute('type', 'password');

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toHaveValue('Login');

    await expect(page.locator('[data-test="error"]')).toHaveCount(0);

    // 3. Read the credentials hint block.
    const credentials = page.locator('[data-test="login-credentials"]');
    await expect(credentials).toContainText('Accepted usernames are:');
    for (const user of [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user',
    ]) {
      await expect(credentials).toContainText(user);
    }

    const passwordHint = page.locator('[data-test="login-password"]');
    await expect(passwordHint).toContainText('Password for all users:');
    await expect(passwordHint).toContainText('secret_sauce');
  });
});
