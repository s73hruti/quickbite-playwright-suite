/*
Test Case ID: TC-E2E-08
Title: US customer completes checkout with mobile payment
Preconditions: Demo app running and reachable; attendant has valid US store credentials; daypart set to
all-day.
Priority: High

Steps:

1. Navigate to the login page with market set to US.
2. Enter store ID 4821 and PIN 1234.
3. Go to the menu with daypart set to all-day.
4. Confirm the all-day daypart banner is NOT shown.
5. Add the classic burger (us-ad-01) to the order.
6. Verify the cart total shows $5.79.
7. Click "Checkout".
8. Verify the checkout summary total also shows $5.79.
9. Select mobile payment as the method.
10. Click "Place Order".
11. Verify the Confirmation page shows an order number matching QB-######.

Expected Result: Checkout completes correctly when US is paired with mobile payment — US has only ever
been tested with card until now.
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { MenuPage } from '../../src/pages/menu.page.js';
import { CheckoutPage } from '../../src/pages/checkout.page.js';
import { ConfirmationPage } from '../../src/pages/confirmation.page.js';
import { formatMoney } from '../../src/utils/money.js';

test.describe('US Mobile Payment E2E Test', () => {
  test('US customer completes checkout with mobile payment @TC-E2E-08', async ({ page }) => {
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

    await test.step('check out with mobile payment', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(5.79, '$'));
      await checkoutPage.checkoutWith('mobile');
    });

    await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
  });
});