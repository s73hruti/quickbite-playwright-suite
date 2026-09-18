/*
Test Case ID: TC-SMOKE-01
Title: UK attendant completes a breakfast order and pays with cash
Preconditions: Demo app running and reachable; attendant has valid UK store credentials; daypart forced 
to breakfast via the deterministic ?daypart=breakfast override (so this doesn't depend on real clock time).
Priority: High

Steps:

Navigate to the login page with market set to UK.
Enter store ID 4821 and PIN 1234.
Confirm the breakfast daypart banner is visible on the Menu page.
Locate "Sunrise Bacon Roll" and add it to the order.
Verify the cart total shows £3.49.
Click "Checkout".
Verify the checkout summary total also shows £3.49.
Select "Cash" as the payment method (not the default "Credit / Debit Card").
Click "Place Order".
Verify the Confirmation page shows an order number matching QB-######.

Expected Result: The UK attendant authenticates successfully, the breakfast-specific item and price display 
correctly with UK currency formatting, the cash payment option can be selected and submitted, and the order 
completes with a valid order number.
*/

import {test, expect} from '@playwright/test';
import {LoginPage} from '../../src/pages/login.page.js';
import {MenuPage} from '../../src/pages/menu.page.js';
import {formatMoney} from '../../src/utils/money.js';
import {CheckoutPage} from '../../src/pages/checkout.page.js';
import {ConfirmationPage} from '../../src/pages/confirmation.page.js';

test.describe('Payment Smoke Test', () =>
{
test('UK attendant completes a breakfast order and pays with cash @smoke @TC-SMOKE-01 @US @UK @DE @PT @CA',async ({page}) =>
{
    const loginPage = new LoginPage(page); //why passing page
    const menuPage = new MenuPage(page);
        const checkoutPage = new CheckoutPage(page);
            const confirmationPage = new ConfirmationPage(page);

await test.step('log in as a UK store attendant', async() =>{
    await loginPage.loginAs('3333','6982','UK');
});
await test.step('confirm the breakfast banner is visible', async() =>{
    await menuPage.gotoForMarket('UK',{ daypart:'breakfast'});
    await menuPage.expectDaypartBanner(true)
});
await test.step('add the breakfast item to the order', async() =>{
    await menuPage.addItemToOrderByName('Sunrise Bacon Roll');
    await menuPage.expectCartTotal(formatMoney(3.49,'£'));
});
    await test.step('check out with cash', async () => {
      await menuPage.proceedToCheckout();
      await checkoutPage.expectTotal(formatMoney(3.49, '£'));
      await checkoutPage.checkoutWith('cash');
    });
        await test.step('confirm the order number is shown', async () => {
      await confirmationPage.expectOrderNumberVisible();
      const orderNumber = await confirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^QB-\d{6}$/);
    });
});
});
