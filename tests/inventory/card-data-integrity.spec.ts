// spec: specs/inventory-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

const catalog = [
  { name: 'Sauce Labs Backpack', slug: 'sauce-labs-backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', slug: 'sauce-labs-bike-light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', slug: 'sauce-labs-bolt-t-shirt', price: '$15.99' },
  { name: 'Sauce Labs Fleece Jacket', slug: 'sauce-labs-fleece-jacket', price: '$49.99' },
  { name: 'Sauce Labs Onesie', slug: 'sauce-labs-onesie', price: '$7.99' },
  { name: 'Test.allTheThings() T-Shirt (Red)', slug: 'test.allthethings()-t-shirt-(red)', price: '$15.99' },
];

test.describe('Inventory', () => {
  test('Each product card shows image, name, description, price and Add to cart button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. For each of the 6 cards read image, name, description, price, button
    const cards = page.locator('[data-test="inventory-item"]');
    await expect(cards).toHaveCount(6);

    for (let i = 0; i < catalog.length; i++) {
      const product = catalog[i];
      const card = cards.nth(i);

      const image = card.locator('img');
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', product.name);
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

      await expect(card.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
      await expect(card.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
      await expect(card.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);
      await expect(card.locator('[data-test="inventory-item-price"]')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(card.locator(`[data-test="add-to-cart-${product.slug}"]`)).toHaveText('Add to cart');
    }

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });
});
