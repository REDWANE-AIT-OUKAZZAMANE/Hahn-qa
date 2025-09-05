import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/helpers';
import { testData, generateRandomTask } from '../utils/test-data';

test.describe('Task Management Flow Tests', () => {
  let helpers: TestHelpers;
  const testTask = generateRandomTask();

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Login before each test
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
  });

  test('TC006: Create Task with Valid Data', async ({ page }) => {
    // Create a new task
    await helpers.createTask(testTask.title, testTask.description);
    
    // Verify task appears in the list
    await helpers.expectTaskInList(testTask.title);
    await helpers.expectTaskInList(testTask.description);
    
    // Verify success message
    await helpers.expectSuccessMessage('Task created successfully');
  });

  test('TC007: Edit Existing Task', async ({ page }) => {
    // First create a task
    await helpers.createTask(testTask.title, testTask.description);
    
    // Edit the task
    const updatedTask = generateRandomTask();
    await helpers.editTask(testTask.title, updatedTask.title, updatedTask.description);
    
    // Verify updated task appears in list
    await helpers.expectTaskInList(updatedTask.title);
    await helpers.expectTaskInList(updatedTask.description);
    
    // Verify old task is no longer visible
    await helpers.expectTaskNotInList(testTask.title);
  });

  test('TC008: Delete Task', async ({ page }) => {
    // First create a task
    await helpers.createTask(testTask.title, testTask.description);
    
    // Verify task exists
    await helpers.expectTaskInList(testTask.title);
    
    // Delete the task
    await helpers.deleteTask(testTask.title);
    
    // Verify task is removed from list
    await helpers.expectTaskNotInList(testTask.title);
    
    // Verify success message
    await helpers.expectSuccessMessage('Task deleted successfully');
  });

  test('TC009: Mark Task as Complete', async ({ page }) => {
    // First create a task
    await helpers.createTask(testTask.title, testTask.description);
    
    // Mark task as complete
    await helpers.markTaskComplete(testTask.title);
    
    // Verify task is marked as complete (check for strikethrough or completed styling)
    const taskRow = page.locator(`tr:has-text("${testTask.title}")`);
    await expect(taskRow).toHaveClass(/completed/);
  });

  test('TC010: Create Task with Empty Fields', async ({ page }) => {
    // Try to create task with empty fields
    await page.click('text=Add New Task');
    await page.click('button[type="submit"]');
    
    // Verify validation errors
    await helpers.expectErrorMessage('Title is required');
    await helpers.expectErrorMessage('Description is required');
  });

  test('TC011: View Task List', async ({ page }) => {
    // Create multiple tasks
    const task1 = generateRandomTask();
    const task2 = generateRandomTask();
    
    await helpers.createTask(task1.title, task1.description);
    await helpers.createTask(task2.title, task2.description);
    
    // Verify both tasks are visible in the list
    await helpers.expectTaskInList(task1.title);
    await helpers.expectTaskInList(task2.title);
    
    // Verify task information is displayed correctly
    await expect(page.locator('text=Task List')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('TC012: Task Persistence After Logout/Login', async ({ page }) => {
    // Create a task
    await helpers.createTask(testTask.title, testTask.description);
    
    // Verify task exists
    await helpers.expectTaskInList(testTask.title);
    
    // Logout
    await helpers.logout();
    
    // Login again
    await helpers.login(testData.users.valid.existingUser, testData.users.valid.existingPassword);
    
    // Verify task still exists
    await helpers.expectTaskInList(testTask.title);
  });

  test('Task Creation with Long Content', async ({ page }) => {
    // Create task with long title and description
    const longTask = {
      title: testData.tasks.invalid.longTitle,
      description: testData.tasks.invalid.longDescription
    };
    
    await helpers.createTask(longTask.title, longTask.description);
    
    // Verify task is created (or validation error if limits are enforced)
    const taskExists = await page.locator(`text=${longTask.title}`).isVisible();
    const validationError = await page.locator('text=Title too long').isVisible();
    
    expect(taskExists || validationError).toBeTruthy();
  });

  test('Task Search and Filter Functionality', async ({ page }) => {
    // Create multiple tasks
    const task1 = generateRandomTask();
    const task2 = generateRandomTask();
    
    await helpers.createTask(task1.title, task1.description);
    await helpers.createTask(task2.title, task2.description);
    
    // Test search functionality if available
    const searchInput = page.locator('input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(task1.title);
      await helpers.expectTaskInList(task1.title);
      await helpers.expectTaskNotInList(task2.title);
    }
  });
});
