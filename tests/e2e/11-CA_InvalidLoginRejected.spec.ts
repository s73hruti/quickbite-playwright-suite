/*
Test Case ID: TC-E2E-11
Title: Malformed PIN is rejected on CA
Preconditions: Demo app running and reachable; valid CA store ID; an intentionally malformed PIN
(non-numeric or fewer than 4 digits).
Priority: Medium

Steps:

1. Navigate to the login page with market set to CA.
2. Enter store ID 3390 (valid) and PIN "ab" (invalid: non-numeric, too short).
3. Submit the login form.
4. Verify the error message matches "valid store id and 4-digit pin".
5. Verify the URL is still on index.html (login page), confirming no navigation happened.

Expected Result: A malformed PIN is rejected with a format-validation message, and the attendant stays on
the login page — extends the format-validation check (TC-E2E-14 on US) to a second market.

NOTE: originally this test entered a well-formed-but-wrong PIN expecting rejection, which the app doesn't
actually do (see TC-SMOKE-05's note). Rewritten to test PIN format validation instead.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';

test.describe('CA Invalid Login E2E Test', () => {
  test('malformed PIN is rejected on CA @TC-E2E-11 @CA', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('attempt login with a malformed PIN', async () => {
      await loginPage.loginAs('3390', 'ab', 'CA');
    });

    await test.step('confirm the format-validation error is shown and no navigation happened', async () => {
      await loginPage.expectErrorMessage(/valid store id and 4-digit pin/i);
      await expect(page).toHaveURL(/index\.html/);
    });
  });
});