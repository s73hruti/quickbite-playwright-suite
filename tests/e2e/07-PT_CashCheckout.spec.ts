/*
Test Case ID: TC-E2E-07
Title: DE customer completes checkout with cash payment
Preconditions: Demo app running and reachable; attendant has valid DE store credentials; daypart set to
all-day.
Priority: High

Steps:

1. Navigate to the login page with market set to PT.
2. Enter store ID 9004 and PIN 5678.
3. Go to the menu with daypart set to all-day.
4. Add the all-day item (pt-ad-01) to the order.
5. Verify the cart total shows €5.49.
6. Click "Checkout".
7. Verify the checkout summary total also shows €5.49.
8. Select "Cash" as the payment method.
9. Click "Place Order".
10. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: Checkout completes correctly when PT is paired with cash payment — PT has only ever
been tested with card until now.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('PT Cash Payment E2E Test', () => {
  test('PT customer completes checkout with cash payment @TC-E2E-07 @PT', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a PT store attendant', async () => {
      await loginPage.loginAs('9004', '5678', 'PT');
    });

    await test.step('add the all-day item to the order', async () => {
      await menuPage.gotoForMarket('PT', { daypart: 'allday' });
      await menuPage.addItemToOrder('pt-ad-01');
      await menuPage.expectCartTotal(formatMoney(4.49, '€'));
    });

    await test.step('check out with cash', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(4.49, '€'));
      await checkoutPage.checkoutWith('cash');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});