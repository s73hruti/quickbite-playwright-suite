/*
Test Case ID: TC-SMOKE-03
Title: Menu loads with items visible
Preconditions: Demo app running and reachable; attendant has valid credentials.
Priority: Critical

Steps:

1. Navigate to the login page with market set to PT.
2. Log in with valid store ID and PIN.
3. Land on the Menu page.
4. Verify at least one menu item is visible.

Expected Result: The menu page renders with at least one item visible, independent of any cart or checkout
interaction. This isolates "did the app boot and load its menu data" from checkout/payment logic entirely.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('Menu Render Smoke Test', () => {
  test('menu loads with at least one item visible @smoke @TC-SMOKE-03', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a PT store attendant', async () => {
      await loginPage.loginAs('3153', '6119', 'PT');
    });

    await test.step('confirm the menu renders at least one item', async () => {
      await menuPage.gotoForMarket('PT', { daypart: 'breakfast' });
      await expect(page.locator('.menu-item').first()).toBeVisible();
    });
  });
});