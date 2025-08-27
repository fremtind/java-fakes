import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSummaryPage } from '../pages/OrderSummaryPage';
import { TestData } from '../data/testData';

type WebshopFixtures = {
  loginPage: LoginPage;
  shopPage: ShopPage;
  checkoutPage: CheckoutPage;
  orderSummaryPage: OrderSummaryPage;
};

// Function to create a test suite with a specific scenario ID
export function createTestWithScenario(scenarioId: string) {
  return base.extend<WebshopFixtures>({
    loginPage: async ({ page }, use) => {
      // Set scenario cookie before each test
      await page.context().addCookies([
        {
          name: TestData.SCENARIO.COOKIE_NAME,
          value: scenarioId,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        }
      ]);

      await use(new LoginPage(page));
    },

    shopPage: async ({ page }, use) => {
      await use(new ShopPage(page));
    },

    checkoutPage: async ({ page }, use) => {
      await use(new CheckoutPage(page));
    },

    orderSummaryPage: async ({ page }, use) => {
      await use(new OrderSummaryPage(page));
    },
  });
}

// Default test for backward compatibility
export const test = createTestWithScenario(TestData.SCENARIO.COOKIE_VALUE);
export { expect } from '@playwright/test';
