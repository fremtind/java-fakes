import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Perform login with the given email
   */
  async login(email: string): Promise<void> {
    await this.page.goto('/');
    await this.page.fill('input[type="email"]', email);
    await this.page.click('button[type="submit"]');
    await this.waitForPageLoad();
  }

  /**
   * Check if user is logged in by verifying cart visibility
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await expect(this.page.getByText('Your cart is empty')).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
