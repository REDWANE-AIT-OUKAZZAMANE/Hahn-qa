import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Application loads successfully', async ({ page }) => {
    // Test if the application loads without errors
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Crud App/);
    
    // Check if login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('Login page elements are present', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for login form elements
    await expect(page.locator('h2:has-text("Login")')).toBeVisible();
    await expect(page.locator('a:has-text("Register")')).toBeVisible();
    
    // Check for form inputs
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('Registration link works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on register link
    await page.click('text=Register');
    
    // Check if registration form is visible
    await expect(page.locator('h2:has-text("Register")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
