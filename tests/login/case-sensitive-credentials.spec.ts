// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('Credentials are case sensitive', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    const error = page.locator('[data-test="error"]');
    const mismatch = 'Epic sadface: Username and password do not match any user in this service';

    // 1. Fresh page; enter STANDARD_USER / secret_sauce; click Login.
    await loginPage.login('STANDARD_USER', 'secret_sauce');
    await expect(error).toHaveText(mismatch);

    // 2. Reload; enter standard_user / SECRET_SAUCE; click Login.
    await page.reload();
    await expect(error).toHaveCount(0);
    await loginPage.login('standard_user', 'SECRET_SAUCE');
    await expect(error).toHaveText(mismatch);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
