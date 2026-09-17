/*
Test Case ID: TC-E2E-14
Title: Malformed PIN is rejected with a format-specific error
Preconditions: Demo app running and reachable; valid US store ID; an intentionally malformed PIN
(non-numeric or fewer than 4 digits).
Priority: Medium

Steps:

1. Navigate to the login page with market set to US.
2. Enter store ID 4821 (valid) and PIN "ab" (invalid: non-numeric, too short).
3. Submit the login form.
4. Verify the error message matches "valid store id and 4-digit pin".
5. Verify the URL is still on index.html (login page), confirming no navigation happened.

Expected Result: A malformed PIN is rejected with a specific format-validation message, and the attendant
stays on the login page.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';

test.describe('Malformed PIN E2E Test', () => {
  test('malformed PIN is rejected with a format-specific error @TC-E2E-14', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('attempt login with a malformed PIN', async () => {
      await loginPage.loginAs('4821', 'ab', 'US');
    });

    await test.step('confirm the format-validation error is shown and no navigation happened', async () => {
      await loginPage.expectErrorMessage(/valid store id and 4-digit pin/i);
      await expect(page).toHaveURL(/index\.html/);
    });
  });
});