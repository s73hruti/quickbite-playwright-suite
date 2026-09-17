/*
Test Case ID: TC-E2E-09
Title: Two consecutive orders in the same session receive different order numbers
Preconditions: Demo app running and reachable; attendant has valid US store credentials; daypart set to
all-day.
Priority: Medium

Steps:

1. Navigate to the login page with market set to US.
2. Enter store ID 4821 and PIN 1234.
3. Add the classic burger (us-ad-01) to the order and complete checkout with card.
4. Record the first order number shown on the Confirmation page.
5. Return to the menu, add the same item again, and complete checkout with card a second time.
6. Record the second order number shown on the Confirmation page.
7. Verify the two order numbers are different.

Expected Result: Each completed order gets a unique order number — nothing currently checks that order
numbers don't repeat within a session, only that they're correctly formatted.

Note: this re-navigates to the menu via gotoForMarket after the first order instead of using a "back to
menu" button, since I haven't seen the Confirmation page's navigation options. If there's a dedicated
"New Order" action, swap it in.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('Unique Order Number E2E Test', () => {
  test('two consecutive orders receive different order numbers @TC-E2E-09', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a US store attendant', async () => {
      await loginPage.loginAs('4821', '1234', 'US');
    });

    let firstOrderNumber: string;
    let secondOrderNumber: string;

    await test.step('place the first order and record its order number', async () => {
      await menuPage.gotoForMarket('US', { daypart: 'allday' });
      await menuPage.addItemToOrder('us-ad-01');
      await menuPage.expectCartTotal(formatMoney(5.79, '$'));
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(5.79, '$'));
      await checkoutPage.checkoutWith('card');
      await confirmationPage.expectOrderNumberVisible();
      firstOrderNumber = await confirmationPage.getOrderNumber();
    });

    await test.step('place a second order and record its order number', async () => {
      await menuPage.gotoForMarket('US', { daypart: 'allday' });
      await menuPage.addItemToOrder('us-ad-01');
      await menuPage.expectCartTotal(formatMoney(5.79, '$'));
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(5.79, '$'));
      await checkoutPage.checkoutWith('card');
      await confirmationPage.expectOrderNumberVisible();
      secondOrderNumber = await confirmationPage.getOrderNumber();
    });

    await test.step('confirm the two order numbers are different', async () => {
      expect(firstOrderNumber).not.toBe(secondOrderNumber);
    });
  });
});