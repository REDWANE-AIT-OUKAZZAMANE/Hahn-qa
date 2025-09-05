import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/helpers';
import { testData } from '../utils/test-data';

test.describe('Navigation and UI Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('Application Navigation Flow', async ({ page }) => {
    // Start at login page
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible();
    
    // Navigate to registration
    await page.click('text=Register');
    await expect(page.locator('text=Register')).toBeVisible();
    
    // Navigate back to login
    await page.click('text=Login');
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Responsive Design - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify login form is visible and properly sized
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test login on mobile
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Responsive Design - Tablet View', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verify elements are properly displayed
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Test login on tablet
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Loading States and Spinners', async ({ page }) => {
    // Monitor network requests
    await page.route('**/api/**', route => {
      // Add delay to test loading states
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto('/');
    
    // Test login loading state
    await page.fill('input[type="email"]', testData.users.valid.existingUser);
    await page.fill('input[type="password"]', testData.users.valid.existingPassword);
    await page.click('button[type="submit"]');
    
    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"], .spinner, .loading');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('Error Handling and User Feedback', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/users/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/');
    await page.fill('input[type="email"]', testData.users.valid.existingUser);
    await page.fill('input[type="password"]', testData.users.valid.existingPassword);
    await page.click('button[type="submit"]');
    
    // Verify error message is displayed
    await helpers.expectErrorMessage('Something went wrong');
  });

  test('Form Validation Messages', async ({ page }) => {
    await page.goto('/');
    
    // Test empty form submission
    await page.click('button[type="submit"]');
    
    // Verify validation messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('Accessibility - Keyboard Navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('Accessibility - ARIA Labels and Roles', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Verify elements have proper accessibility attributes
    await expect(emailInput).toHaveAttribute('aria-label');
    await expect(passwordInput).toHaveAttribute('aria-label');
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('Browser Back/Forward Navigation', async ({ page }) => {
    // Login and navigate to dashboard
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/.*login/);
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Session Management - Page Refresh', async ({ page }) => {
    // Login
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Refresh page
    await page.reload();
    
    // Verify user is still logged in
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
