import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderSummaryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify that the order is confirmed
   */
  async isOrderConfirmed(): Promise<boolean> {
    try {
      await expect(this.page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify order confirmation heading is visible
   */
  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
  }

  /**
   * Get order details (placeholder for future implementation)
   */
  async getOrderDetails(): Promise<Record<string, string>> {
    // This could be expanded to return actual order details if needed
    return {};
  }
}
