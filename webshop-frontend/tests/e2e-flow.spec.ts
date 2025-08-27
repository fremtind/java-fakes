import {createTestWithScenario, expect} from './fixtures/webshopFixtures';
import {TestData} from './data/testData';

const test = createTestWithScenario('e2e-flow');

test.describe('End-to-End Shopping Flow', () => {
    test('should complete full shopping journey', async ({
                                                             loginPage, shopPage, checkoutPage, orderSummaryPage
                                                         }) => {
        // Login and verify products are available
        await loginPage.login(TestData.USER.EMAIL);
        expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_1)).toBe(true);
        expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_2)).toBe(true);

        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_2);
        await shopPage.verifyCartTotal('Total: $300.00');
        await shopPage.proceedToCheckout();

        await checkoutPage.verifyOrderConfirmationPage();
        await checkoutPage.verifyProductInOrder(TestData.PRODUCTS.PRODUCT_1);
        await checkoutPage.verifyProductInOrder(TestData.PRODUCTS.PRODUCT_2);
        await checkoutPage.verifyProductPriceAndQuantity('$100.00 × 1');
        await checkoutPage.verifyProductPriceAndQuantity('$200.00 × 1');
        await checkoutPage.verifyTotalAmount('$300.00');
        await checkoutPage.verifyCustomerEmail(TestData.USER.EMAIL);
        await checkoutPage.confirmOrder();

        await orderSummaryPage.verifyOrderConfirmation();
    });

    test('should complete single product purchase journey', async ({
                                                                       loginPage,
                                                                       shopPage,
                                                                       checkoutPage,
                                                                       orderSummaryPage
                                                                   }) => {
        await loginPage.login(TestData.USER.EMAIL);
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
        await shopPage.proceedToCheckout();

        await checkoutPage.verifyOrderConfirmationPage();
        await checkoutPage.verifyProductInOrder(TestData.PRODUCTS.PRODUCT_1);
        await checkoutPage.verifyProductPriceAndQuantity('$100.00 × 1');
        await checkoutPage.verifyTotalAmount('$100.00');
        await checkoutPage.verifyCustomerEmail(TestData.USER.EMAIL);
        await checkoutPage.confirmOrder();

        await orderSummaryPage.verifyOrderConfirmation();
    });
});
