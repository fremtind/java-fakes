import { createTestWithScenario, expect } from './fixtures/webshopFixtures';
import { TestData } from './data/testData';

const test = createTestWithScenario('login');

test.describe('Login Page functionality', () => {
    test('should successfully login with valid email', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL);
        expect(await shopPage.isCartEmpty()).toBe(true);
    });

    test('should verify login state persistence', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL);
        expect(await loginPage.isLoggedIn()).toBe(true);
        expect(await shopPage.isCartEmpty()).toBe(true);
    });

    test('should navigate to shop page after successful login', async ({ loginPage, shopPage }) => {
        await loginPage.login(TestData.USER.EMAIL);
        expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_1)).toBe(true);
    });
});
