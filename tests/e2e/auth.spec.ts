import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/helpers';
import { testData } from '../utils/test-data';

test.describe('Authentication Flow Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
  });

  test('TC002: User Login with Valid Credentials', async ({ page }) => {
    // Test successful login with existing credentials
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    
    // Verify user is redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify dashboard elements are visible
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('text=Add New Task')).toBeVisible();
  });

  test('TC003: Login with Invalid Credentials', async ({ page }) => {
    // Attempt login with invalid credentials
    await page.fill('input[type="email"]', testData.users.valid.email);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message is displayed
    await helpers.expectErrorMessage('Invalid email or password');
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC004: Registration with Invalid Email Format', async ({ page }) => {
    // Navigate to registration page
    await page.click('text=Register');
    
    // Fill form with invalid email
    await page.fill('input[type="email"]', testData.users.valid.invalidEmail);
    await page.fill('input[type="password"]', testData.users.valid.password);
    await page.click('button[type="submit"]');
    
    // Verify validation error
    await helpers.expectErrorMessage('Please enter a valid email address');
  });

  test('TC005: Access Protected Routes Without Authentication', async ({ page }) => {
    // Try to access dashboard directly without login
    await page.goto('/dashboard');
    
    // Verify redirect to login page
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('User Logout Functionality', async ({ page }) => {
    // Login first
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    
    // Verify user is on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Logout
    await helpers.logout();
    
    // Verify redirect to login page
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('Password Field Validation', async ({ page }) => {
    // Navigate to registration page
    await page.click('text=Register');
    
    // Fill form with short password
    await page.fill('input[type="email"]', testData.users.valid.email);
    await page.fill('input[type="password"]', testData.users.valid.invalidPassword);
    await page.click('button[type="submit"]');
    
    // Verify password validation error
    await helpers.expectErrorMessage('Password must be at least 6 characters');
  });
});
