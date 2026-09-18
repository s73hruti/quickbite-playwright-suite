/*
Test Case ID: TC-E2E-10
Title: All-day daypart correctly hides the breakfast banner
Preconditions: Demo app running and reachable; attendant has valid UK store credentials; daypart set to
all-day.
Priority: Medium

Steps:

1. Navigate to the login page with market set to UK.
2. Enter store ID 4821 and PIN 1234.
3. Go to the menu with daypart set to all-day.
4. Verify the breakfast banner is NOT shown.

Expected Result: The breakfast banner only appears during the breakfast daypart — confirms it's not
just always-on.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('UK All-Day Daypart E2E Test', () => {
  test('all-day daypart hides the breakfast banner @TC-E2E-10 @UK', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a UK store attendant', async () => {
      await loginPage.loginAs('4821', '1234', 'UK');
    });

    await test.step('confirm the breakfast banner is not shown during all-day', async () => {
      await menuPage.gotoForMarket('UK', { daypart: 'allday' });
      await menuPage.expectDaypartBanner(false);
    });
  });
});