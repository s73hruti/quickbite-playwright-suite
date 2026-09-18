/*
Test Case ID: TC-E2E-13
Title: Combo upsell badge appears on all-day items when the feature flag is enabled
Preconditions: Demo app running and reachable; attendant has valid PT store credentials; combo upsell
feature flag enabled.
Priority: High

Steps:

1. Navigate to the login page with market set to PT.
2. Enter store ID 9004 and PIN 5678.
3. Go to the menu with daypart set to all-day and comboFlag set to true.
4. Verify the combo upsell badge IS visible on pt-ad-01.

Expected Result: When the combo upsell feature flag is enabled, the combo badge renders on a combo-eligible
item. This is the positive counterpart to TC-E2E-13 (badge hidden when the flag is disabled) — together
they cover both states of the flag, not just one.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';

test.describe('PT Combo Badge E2E Test', () => {
  test('combo badge appears when the feature flag is enabled @TC-E2E-13 @PT', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await test.step('log in as a PT store attendant', async () => {
      await loginPage.loginAs('9004', '5678', 'PT');
    });

    await test.step('confirm the combo badge is shown when the flag is on', async () => {
      await menuPage.gotoForMarket('PT', { daypart: 'allday', comboFlag: true });
      await menuPage.expectComboBadgeVisible('pt-ad-01', true);
    });
  });
});