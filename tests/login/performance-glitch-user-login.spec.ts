// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login and Authentication', () => {
  test('performance_glitch_user logs in after a delay', async ({ page }) => {
    test.setTimeout(60_000);

    // 1. Fresh page; login as performance_glitch_user / secret_sauce; wait for /inventory.html.
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('performance_glitch_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/, { timeout: 20_000 });
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6, { timeout: 20_000 });
  });
});
