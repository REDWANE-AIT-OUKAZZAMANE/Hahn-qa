import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async login(email: string, password: string): Promise<void> {
    await this.page.goto('/');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('**/dashboard');
  }

  async logout(): Promise<void> {
    await this.page.click('text=Logout');
    await this.page.waitForURL('**/');
  }

  async createTask(title: string, description: string): Promise<void> {
    await this.page.click('text=Add New Task');
    await this.page.fill('input[name="title"]', title);
    await this.page.fill('textarea[name="description"]', description);
    await this.page.click('button[type="submit"]');
  }

  async editTask(oldTitle: string, newTitle: string, newDescription: string): Promise<void> {
    const taskRow = this.page.locator(`tr:has-text("${oldTitle}")`);
    await taskRow.locator('button:has-text("Edit")').click();
    await this.page.fill('input[name="title"]', newTitle);
    await this.page.fill('textarea[name="description"]', newDescription);
    await this.page.click('button[type="submit"]');
  }

  async deleteTask(title: string): Promise<void> {
    const taskRow = this.page.locator(`tr:has-text("${title}")`);
    await taskRow.locator('button:has-text("Delete")').click();
    await this.page.click('button:has-text("Confirm")');
  }

  async markTaskComplete(title: string): Promise<void> {
    const taskRow = this.page.locator(`tr:has-text("${title}")`);
    await taskRow.locator('input[type="checkbox"]').check();
  }

  async expectTaskInList(title: string): Promise<void> {
    await expect(this.page.locator(`text=${title}`)).toBeVisible();
  }

  async expectTaskNotInList(title: string): Promise<void> {
    await expect(this.page.locator(`text=${title}`)).not.toBeVisible();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
