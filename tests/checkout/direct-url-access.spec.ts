// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Direct URL Access', () => {
  test('Direct access to checkout pages when logged in (observed behaviour)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    const baseUrl = process.env.BASE_URL as string;

    // 1. With empty cart goto /checkout-step-one.html
    // NOTE: This documents current app behaviour: the page loads directly with no redirect.
    await page.goto(new URL('/checkout-step-one.html', baseUrl).toString());
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // 2. goto /checkout-step-two.html without completing step one
    // NOTE: This documents current app behaviour: overview loads with no items and no redirect.
    await page.goto(new URL('/checkout-step-two.html', baseUrl).toString());
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');

    // 3. goto /checkout-complete.html without ordering
    // NOTE: This documents current app behaviour (an app weakness): the thank-you page is shown
    // even though no order was placed, and there is no redirect.
    await page.goto(new URL('/checkout-complete.html', baseUrl).toString());
    await expect(page).toHaveURL(/\/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="back-to-products"]')).toHaveText('Back Home');
  });
});
