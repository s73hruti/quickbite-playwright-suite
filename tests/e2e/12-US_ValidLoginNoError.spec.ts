/*
Test Case ID: TC-E2E-12
Title: Successful login lands on the menu page
Preconditions: Demo app running and reachable; attendant has valid US store credentials.
Priority: Low

Steps:

1. Navigate to the login page with market set to US.
2. Enter valid store ID 4821 and PIN 1234.
3. Submit the login form.
4. Verify the URL matches menu.html.
5. Verify the cart starts empty.

Expected Result: A correct login navigates the attendant to menu.html with an empty cart.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('Valid Login E2E Test', () => {
  test('valid store ID and PIN logs the attendant into the menu screen @TC-E2E-12', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in with valid US credentials', async () => {
      await loginPage.loginAs('4821', '1234', 'US');
    });

    await test.step('confirm the menu screen is shown with an empty cart', async () => {
      await expect(page).toHaveURL(/menu\.html/);
      await menuPage.expectCartEmpty();
    });
  });
});