// spec: specs/login-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

// Number of product images (in page order) expected to use the sl-404 placeholder.
const users: { name: string; placeholderIndexes: number[] }[] = [
  { name: 'problem_user', placeholderIndexes: [0, 1, 2, 3, 4, 5] },
  { name: 'error_user', placeholderIndexes: [] },
  { name: 'visual_user', placeholderIndexes: [0] },
];

test.describe('Login and Authentication', () => {
  for (const { name, placeholderIndexes } of users) {
    test(`problem_user, error_user and visual_user reach inventory - ${name}`, async ({ page }) => {
      // 1. Fresh page, login with secret_sauce.
      const loginPage = new LoginPage(page);
      await loginPage.navigateTo();
      await loginPage.login(name, 'secret_sauce');

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
      await expect(page.locator('[data-test="error"]')).toHaveCount(0);
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

      // 2. Verify user-specific image behaviour.
      const images = page.locator('.inventory_item_img img');
      await expect(images).toHaveCount(6);
      for (let i = 0; i < 6; i++) {
        if (placeholderIndexes.includes(i)) {
          await expect(images.nth(i)).toHaveAttribute('src', /sl-404/);
        } else {
          await expect(images.nth(i)).not.toHaveAttribute('src', /sl-404/);
        }
      }
    });
  }
});
