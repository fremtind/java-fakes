import { createTestWithScenario, expect } from './fixtures/webshopFixtures';
import { TestData } from './data/testData';

const test = createTestWithScenario('order-summary');

test.describe('Order Summary Page functionality', () => {
    test('should display order confirmation after successful order', async ({
        loginPage, shopPage, checkoutPage, orderSummaryPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1); // Minimal shop setup
        await shopPage.proceedToCheckout(); // Minimal checkout navigation
        await checkoutPage.confirmOrder(); // Minimal checkout action

        await orderSummaryPage.verifyOrderConfirmation();
        expect(await orderSummaryPage.isOrderConfirmed()).toBe(true);
    });

    test('should verify order confirmation state', async ({
        loginPage, shopPage, checkoutPage, orderSummaryPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_2); // Minimal shop setup
        await shopPage.proceedToCheckout(); // Minimal checkout navigation
        await checkoutPage.confirmOrder(); // Minimal checkout action

        expect(await orderSummaryPage.isOrderConfirmed()).toBe(true);
    });
});
