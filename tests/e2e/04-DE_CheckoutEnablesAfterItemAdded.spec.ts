/*
Test Case ID: TC-E2E-04
Title: Checkout button becomes enabled once an item is added to the cart
Preconditions: Demo app running and reachable; attendant has valid DE store credentials; daypart forced
to breakfast.
Priority: High

Steps:

1. Navigate to the login page with market set to DE.
2. Enter store ID 4821 and PIN 1234.
3. Go to the menu with daypart forced to breakfast.
4. Verify checkout is disabled while the cart is empty.
5. Add "Filterkaffee" to the order.
6. Verify checkout becomes enabled.

Expected Result: Checkout starts disabled with an empty cart and becomes enabled as soon as an item is
added. Smoke only checks the "still empty" state; this confirms the actual transition.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('Checkout State E2E Test', () => {
  test('checkout enables once an item is added to the cart @TC-E2E-04', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a DE store attendant', async () => {
      await loginPage.loginAs('4821', '1234', 'DE');
    });

    await test.step('confirm checkout is disabled with an empty cart', async () => {
      await menuPage.gotoForMarket('DE', { daypart: 'breakfast' });
      await menuPage.expectCartEmpty();
      await menuPage.expectCheckoutEnabled(false);
    });

    await test.step('add an item and confirm checkout becomes enabled', async () => {
      await menuPage.addItemToOrderByName('Filterkaffee');
      await menuPage.expectCheckoutEnabled(true);
    });
  });
});