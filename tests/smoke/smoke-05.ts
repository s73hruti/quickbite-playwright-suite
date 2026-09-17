/*
Test Case ID: TC-SMOKE-05
Title: Malformed PIN is rejected on UK
Preconditions: Demo app running and reachable; valid UK store ID; an intentionally malformed PIN
(non-numeric or fewer than 4 digits).
Priority: Critical

Steps:

1. Navigate to the login page with market set to UK.
2. Enter store ID 4821 (valid) and PIN "ab" (invalid: non-numeric, too short).
3. Submit the login form.
4. Verify the error message matches "valid store id and 4-digit pin".
5. Verify the URL is still on index.html (login page), confirming no navigation happened.

Expected Result: A malformed PIN is rejected with a format-validation message, and the attendant stays on
the login page.

NOTE: originally this test entered a well-formed-but-wrong PIN (e.g. '0000') expecting rejection. Testing
confirmed the app only validates PIN format, not PIN value — there's no real credential check in this demo
app, so a wrong-but-valid-shaped PIN just logs in. Rewritten to test what the app actually validates.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';

test.describe('Invalid Login Smoke Test', () => {
  test('malformed PIN is rejected on UK @smoke @TC-SMOKE-05', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('attempt login with a malformed PIN', async () => {
      await loginPage.loginAs('4821', 'ab', 'UK');
    });

    await test.step('confirm the format-validation error is shown and no navigation happened', async () => {
      await loginPage.expectErrorMessage(/valid store id and 4-digit pin/i);
      await expect(page).toHaveURL(/index\.html/);
    });
  });
});