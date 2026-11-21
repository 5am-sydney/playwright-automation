// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Inventory', () => {
  test('Product detail page shows correct name, description, price and image', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Click a product name (Bike Light), then repeat via the product image for Onesie
    const products = [
      { link: '[data-test="item-0-title-link"]', id: 0, name: 'Sauce Labs Bike Light', slug: 'sauce-labs-bike-light' },
      { link: '[data-test="item-2-img-link"]', id: 2, name: 'Sauce Labs Onesie', slug: 'sauce-labs-onesie' },
    ];

    for (const product of products) {
      // Make sure the inventory list is fully rendered (and we are not on a detail page)
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
      const card = page.locator('[data-test="inventory-item"]').filter({ hasText: product.name });
      const cardDescription = await card.locator('[data-test="inventory-item-desc"]').innerText();
      const cardPrice = await card.locator('[data-test="inventory-item-price"]').innerText();

      await page.locator(product.link).click();

      await expect(page).toHaveURL(new RegExp(`inventory-item\\.html\\?id=${product.id}$`));
      // Detail page is rendered only once its back button exists and the inventory list is gone
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveCount(1);
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
      await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(cardDescription);
      await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(cardPrice);

      const image = page.locator(`[data-test="item-${product.slug}-img"]`);
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', product.name);
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
      await expect(page.locator('[data-test="add-to-cart"]')).toHaveText('Add to cart');

      await page.locator('[data-test="back-to-products"]').click();
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    }
  });
});
