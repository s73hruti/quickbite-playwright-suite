/*
Test Case ID: TC-E2E-03
Title: Combo upsell badge is hidden when the feature flag is disabled
Preconditions: Demo app running and reachable; attendant has valid DE store credentials; combo upsell
feature flag explicitly disabled.
Priority: High

Steps:

1. Navigate to the login page with market set to DE.
2. Enter store ID 9004 and PIN 5678.
3. Go to the menu with daypart set to all-day and comboFlag set to false.
4. Verify the combo upsell badge is NOT visible on de-ad-01.

Expected Result: When the combo upsell feature flag is disabled, the combo badge does not render on an
otherwise combo-eligible item. This is the negative case of the existing "flag enabled" DE combo test.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('DE Combo Badge E2E Test', () => {
  test('combo badge is hidden when the feature flag is disabled @TC-E2E-03 @DE', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a DE store attendant', async () => {
      await loginPage.loginAs('9004', '5678', 'DE');
    });

    await test.step('confirm the combo badge is not shown when the flag is off', async () => {
      await menuPage.gotoForMarket('DE', { daypart: 'allday', comboFlag: false });
      await menuPage.expectComboBadgeVisible('de-ad-01', false);
    });
  });
});