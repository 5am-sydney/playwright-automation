import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Seed test used by the Playwright planner/generator/healer agents.
// It prepares the starting state: logged in as standard_user on the inventory page.
test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
