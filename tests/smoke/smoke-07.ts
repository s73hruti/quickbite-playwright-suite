/*
Test Case ID: TC-SMOKE-07
Title: Breakfast daypart banner shows before 11am and hides the all-day combo badge
Preconditions: Demo app running and reachable; attendant has valid UK store credentials; daypart forced
to breakfast via the deterministic override; combo upsell feature flag enabled.
Priority: Critical

Steps:

1. Navigate to the login page with market set to UK.
2. Enter store ID 4821 and PIN 1234.
3. Go to the menu with daypart forced to breakfast and the combo flag enabled.
4. Verify the breakfast banner is visible.
5. Verify the cart is empty.
6. Verify checkout is disabled.

Expected Result: During the breakfast daypart, the breakfast banner displays, the cart starts empty, and
checkout cannot be started until an item is added. This isolates menu/daypart rendering from checkout logic.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('Daypart Banner Smoke Test', () => {
  test('breakfast daypart banner shows before 11am and hides the all-day combo badge @smoke @TC-SMOKE-07', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a UK store attendant', async () => {
      await loginPage.loginAs('4821', '1234', 'UK');
    });

    await test.step('confirm breakfast banner, empty cart, and disabled checkout', async () => {
      await menuPage.gotoForMarket('UK', { daypart: 'breakfast', comboFlag: true });
      await menuPage.expectDaypartBanner(true);
      await menuPage.expectCartEmpty();
      await menuPage.expectCheckoutEnabled(false);
    });
  });
});