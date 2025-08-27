import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify the order confirmation page is displayed
   */
  async verifyOrderConfirmationPage(): Promise<void> {
    await expect(this.page.getByText('Order Confirmation')).toBeVisible();
  }

  /**
   * Verify a product is displayed in the order summary
   */
  async verifyProductInOrder(productName: string): Promise<void> {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  /**
   * Verify product price and quantity
   */
  async verifyProductPriceAndQuantity(priceText: string): Promise<void> {
    await expect(this.page.getByText(priceText)).toBeVisible();
  }

  /**
   * Verify the total amount is displayed
   */
  async verifyTotalAmount(amount: string): Promise<void> {
    // Use the data-testid attribute to reliably find the total amount element
    await expect(this.page.getByTestId('total-amount')).toHaveText(amount);
  }

  /**
   * Verify customer email is displayed
   */
  async verifyCustomerEmail(email: string): Promise<void> {
    await expect(this.page.getByText(email)).toBeVisible();
  }

  /**
   * Confirm the order
   */
  async confirmOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm Order' }).click();
    await this.waitForPageLoad();
  }

  /**
   * Get the displayed customer email
   */
  async getCustomerEmail(): Promise<string> {
    // This would need to be implemented based on actual page structure
    return '';
  }

  /**
   * Get the total amount from the order
   */
  async getOrderTotal(): Promise<string> {
    const totalElement = this.page.getByText(/\$\d+\.\d+/).last();
    return await totalElement.textContent() || '';
  }
}
