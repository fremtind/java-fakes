import { createTestWithScenario, expect } from './fixtures/webshopFixtures';
import { TestData } from './data/testData';

const test = createTestWithScenario('shopping-cart');

test.describe('Shop Page functionality', () => {
    test('should display products from backend', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_1)).toBe(true);
        expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_2)).toBe(true);
    });

    test('should add single product to cart', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
        expect(await shopPage.isCartEmpty()).toBe(false);
    });

    test('should add multiple products to cart', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_2);
        expect(await shopPage.isCartEmpty()).toBe(false);
    });

    test('should calculate correct cart total', async ({ loginPage, shopPage, checkoutPage }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
        await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_2);
        await shopPage.verifyCartTotal('Total: $300.00');

        // Minimal checkout verification - just ensure navigation works
        await shopPage.proceedToCheckout();
        await checkoutPage.verifyOrderConfirmationPage();
    });

    test('should verify empty cart state initially', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL); // Required login
        expect(await shopPage.isCartEmpty()).toBe(true);
    });
});
