/*
Test Case ID: TC-SMOKE-06
Title: Cross-market spot check — DE customer completes checkout with card
Preconditions: Demo app running and reachable; attendant has valid DE store credentials; daypart set to
all-day.
Priority: High

Steps:

1. Navigate to the login page with market set to DE.
2. Enter store ID 9004 and PIN 5678.
3. Go to the menu with daypart set to all-day.
4. Add the all-day item (de-ad-01) to the order.
5. Verify the cart total shows €5.49.
6. Click "Checkout".
7. Verify the checkout summary total also shows €5.49.
8. Select "Card" as the payment method.
9. Click "Place Order".
10. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: The DE attendant authenticates successfully, the item and price display correctly with
DE currency/locale formatting, and checkout completes with a valid order number. This is a single spot
check on a third market (beyond US/UK) to catch a locale-specific breakage without running the full
PT/CA/DE regression set.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('Cross-Market Smoke Test', () => {
  test('DE customer orders an all-day item and pays by card @smoke @TC-SMOKE-06 @US @UK @DE @PT @CA', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a DE store attendant', async () => {
      await loginPage.loginAs('9004', '5678', 'DE');
    });

    await test.step('add the all-day item to the order', async () => {
      await menuPage.gotoForMarket('DE', { daypart: 'allday' });
      await menuPage.addItemToOrder('de-ad-01');
      await menuPage.expectCartTotal(formatMoney(5.49, '€'));
    });

    await test.step('check out with a credit card', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(5.49, '€'));
      await checkoutPage.checkoutWith('card');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});