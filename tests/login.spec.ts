import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.enterUsername('standard_user');
    await loginPage.enterPassword('secret_sauce');
    await loginPage.clickLoginButton();

    // Add assertions to verify successful login
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('div.app_logo')).toHaveText("Swag Labs");
  });

  test('should not login with a locked out user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toContainText('this user has been locked out');
  });

  // test('should show error with invalid credentials', async ({ page }) => {
  //   await loginPage.enterUsername('invalid_user');
  //   await loginPage.enterPassword('invalid_password');
  //   await loginPage.clickLoginButton();

  //   // Add assertions to verify error message
  //   await expect(page.locator('h3[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
  // });
});