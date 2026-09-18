/*
Test Case ID: TC-SMOKE-04
Title: DE attendant completes a breakfast order and pays with mobile payment
Preconditions: Demo app running and reachable; attendant has valid DE store credentials; daypart forced
to breakfast via the deterministic ?daypart=breakfast override.
Priority: High

Steps:

1. Navigate to the login page with market set to DE.
2. Enter store ID 8732 and PIN 4952.
3. Confirm the breakfast daypart banner is visible on the Menu page.
4. Locate "Rösti" and add it to the order.
5. Verify the cart total shows €1.99.
6. Click "Checkout".
7. Select mobile payment as the method.
8. Click "Place Order".
9. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: Mobile payment can be selected and submitted; confirmation shows a valid order number.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('Mobile Payment Smoke Test', () => {
  test('DE attendant completes a breakfast order and pays with mobile payment @smoke @TC-SMOKE-04 @US @UK @DE @PT @CA', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('log in as a DE store attendant', async () => {
      await loginPage.loginAs('8732', '4952', 'DE');
    });

    await test.step('confirm the breakfast banner is visible', async () => {
      await menuPage.gotoForMarket('DE', { daypart: 'breakfast' });
      await menuPage.expectDaypartBanner(true);
    });

    await test.step('add the breakfast item to the order', async () => {
      await menuPage.addItemToOrderByName('Rösti');
      await menuPage.expectCartTotal(formatMoney(1.99, '€'));
    });

    await test.step('check out with mobile payment', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(1.99, '€'));
      await checkoutPage.checkoutWith('mobile');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});