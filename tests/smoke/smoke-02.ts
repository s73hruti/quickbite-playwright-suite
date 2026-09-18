/*
Test Case ID: TC-SMOKE-02
Title: US customer orders an all-day item and pays by card
Preconditions: Demo app running and reachable; attendant has valid US store credentials; daypart set to
all-day (US market, no breakfast window in play).
Priority: Critical

Steps:

1. Navigate to the login page with market set to US.
2. Enter store ID 4821 and PIN 1234.
3. Confirm the all-day daypart banner is NOT shown (US, all-day daypart).
4. Add the classic burger (us-ad-01) to the order.
5. Verify the cart total shows $5.79.
6. Click "Checkout".
7. Verify the checkout summary total also shows $5.79.
8. Select "Card" as the payment method.
9. Click "Place Order".
10. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: The US attendant authenticates successfully, the all-day item and price display correctly
with US currency formatting, card payment completes, and the order confirms with a valid order number.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('Card Payment Smoke Test', () => {
  test('US customer orders an all-day item and pays by card @smoke @TC-SMOKE-02 @US @UK @DE @PT @CA', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a US store attendant', async () => {
      await loginPage.loginAs('4821', '1234', 'US');
    });

    await test.step('add the classic burger to the order', async () => {
      await menuPage.gotoForMarket('US', { daypart: 'allday' });
      await menuPage.expectDaypartBanner(false);
      await menuPage.addItemToOrder('us-ad-01');
      await menuPage.expectCartTotal(formatMoney(5.79, '$'));
    });

    await test.step('check out with a credit card', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(5.79, '$'));
      await checkoutPage.checkoutWith('card');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});