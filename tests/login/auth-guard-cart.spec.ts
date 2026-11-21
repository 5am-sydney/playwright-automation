// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import '../../pages/loginPage'; // loads dotenv so BASE_URL is available

test.describe('Login and Authentication', () => {
  test('Direct access to /cart.html without login is blocked', async ({ page }) => {
    // 1. In a fresh context navigate to BASE_URL/cart.html.
    await page.goto(new URL('/cart.html', process.env.BASE_URL as string).toString());

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: You can only access '/cart.html' when you are logged in."
    );
  });
});
