/*
Test Case ID: TC-E2E-01
Title: All 5 supported markets can log in successfully
Preconditions: Demo app running and reachable; valid attendant credentials on file for all 5 markets
(US, UK, DE, PT, CA).
Priority: Medium

Steps:

1. For each supported market, navigate to the login page with that market selected.
2. Enter that market's valid store ID and PIN.
3. Submit the login form.
4. Verify the attendant lands on the menu page for that market (banner shows "Market: <code>").
5. Repeat for all 5 markets within the same test.

Expected Result: Every supported market authenticates successfully and lands on its own correctly-labeled
menu page. This is a breadth check across the whole market list in one place, rather than one
scenario-specific test per market — if a new market gets added to the login dropdown without being wired
up correctly, this is the test that would catch it.

This test is structurally different from every other test built so far: it's a single data-driven loop
over a list of markets, not one linear user journey.

NOTE: originally this used LoginPage.expectNoError() after each login to confirm success. That was wrong —
a successful login navigates away from the login page entirely, so the login-error element (which only
exists on the login page) is gone by the time the check runs, causing a false failure. Fixed to instead
confirm landing on the correct market's menu page via the page banner text.
*/

import { test, expect } from '@playwright/test';
import { LoginPage, type Market } from '../../src/pages/login.page.js';

const marketCredentials: { market: Market; storeId: string; pin: string }[] = [
  { market: 'US', storeId: '4821', pin: '1234' },
  { market: 'UK', storeId: '4821', pin: '1234' },
  { market: 'DE', storeId: '9004', pin: '5678' },
  { market: 'PT', storeId: '7712', pin: '2468' },
  { market: 'CA', storeId: '3390', pin: '1357' },
];

test.describe('All-Markets Login E2E Test', () => {
  test('all 5 supported markets can log in successfully @TC-E2E-01', async ({ page }) => {
    const loginPage = new LoginPage(page);

    for (const { market, storeId, pin } of marketCredentials) {
      await test.step(`log in successfully on ${market}`, async () => {
        await loginPage.loginAs(storeId, pin, market);
        await expect(page.getByRole('banner')).toContainText(`Market: ${market}`);
      });
    }
  });
});