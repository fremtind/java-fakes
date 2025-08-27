import { createTestWithScenario, expect } from './fixtures/webshopFixtures';
import { TestData } from './data/testData';

const test = createTestWithScenario('checkout');

test.describe('Checkout Page functionality', () => {
    test('should display order confirmation with correct details', async ({
        loginPage, shopPage, checkoutPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1); // Minimal shop setup
        await shopPage.proceedToCheckout();

        await checkoutPage.verifyOrderConfirmationPage();
        await checkoutPage.verifyProductInOrder(TestData.PRODUCTS.PRODUCT_1);
        await checkoutPage.verifyCustomerEmail(TestData.USER.EMAIL);
    });

    test('should verify order totals and pricing for single product', async ({
        loginPage, shopPage, checkoutPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1); // Minimal shop setup
        await shopPage.proceedToCheckout();

        await checkoutPage.verifyProductPriceAndQuantity('$100.00 × 1');
        await checkoutPage.verifyTotalAmount('$100.00');
    });

    test('should verify order totals and pricing for multiple products', async ({
        loginPage, shopPage, checkoutPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1); // Minimal shop setup
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_2);
        await shopPage.proceedToCheckout();

        await checkoutPage.verifyProductPriceAndQuantity('$100.00 × 1');
        await checkoutPage.verifyProductPriceAndQuantity('$200.00 × 1');
        await checkoutPage.verifyTotalAmount('$300.00');
    });

    test('should successfully submit order', async ({
        loginPage, shopPage, checkoutPage, orderSummaryPage
    }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1); // Minimal shop setup
        await shopPage.proceedToCheckout();

        await checkoutPage.confirmOrder();
        // Minimal summary verification - just check navigation worked
        expect(await orderSummaryPage.isOrderConfirmed()).toBe(true);
    });
});
