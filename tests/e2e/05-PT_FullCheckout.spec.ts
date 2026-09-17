/*
Test Case ID: TC-E2E-05
Title: PT customer completes a full checkout through confirmation
Preconditions: Demo app running and reachable; attendant has valid PT store credentials; daypart set to
all-day.
Priority: High

Steps:

1. Navigate to the login page with market set to PT.
2. Enter store ID 7712 and PIN 2468.
3. Go to the menu with daypart set to all-day.
4. Add the all-day item (pt-ad-01) to the order.
5. Verify the cart total shows €4.49.
6. Click "Checkout".
7. Verify the checkout summary total also shows €4.49.
8. Select "Card" as the payment method.
9. Click "Place Order".
10. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: The PT attendant authenticates successfully, the item and price display correctly with
PT currency formatting, and checkout completes with a valid order number. The existing PT test in
checkout.spec.ts only checks the cart total — this extends it all the way through confirmation.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('PT Full Checkout E2E Test', () => {
  test('PT customer completes a full checkout through confirmation @TC-E2E-05', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a PT store attendant', async () => {
      await loginPage.loginAs('7712', '2468', 'PT');
    });

    await test.step('add the all-day item to the order', async () => {
      await menuPage.gotoForMarket('PT', { daypart: 'allday' });
      await menuPage.addItemToOrder('pt-ad-01');
      await menuPage.expectCartTotal(formatMoney(4.49, '€'));
    });

    await test.step('check out with a credit card', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(4.49, '€'));
      await checkoutPage.checkoutWith('card');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});