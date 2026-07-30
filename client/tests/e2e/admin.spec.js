import { test, expect } from '@playwright/test';
import { loginAs } from './testUtils';

test.describe('Admin Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@test.com', 'password123', '**/admin**');
  });

  test('should load Admin Dashboard and show statistics', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Admin Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
  });

  test('should navigate to Student Management', async ({ page }) => {
    await page.getByRole('link', { name: 'Students' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Student Management' })).toBeVisible();
    await expect(page.getByText('Student Test')).toBeVisible();
  });

  test('should navigate to Faculty Management', async ({ page }) => {
    await page.getByRole('link', { name: 'Faculty' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Faculty Management' })).toBeVisible();
    await expect(page.getByText('Faculty Test')).toBeVisible();
  });

  test('should navigate to Departments and Courses', async ({ page }) => {
    await page.getByRole('link', { name: 'Departments' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Departments' })).toBeVisible();
    
    // Add Department flow
    await page.getByRole('button', { name: 'Add Department' }).click();
    await page.fill('input[placeholder="e.g. CSE"]', 'TST');
    // The name input has no placeholder, select it by using the fixed modal context
    await page.locator('.fixed input[type="text"]').first().fill('Test Department');
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByText('Department created successfully')).toBeVisible();
  });

  test('should navigate to Academic Calendar', async ({ page }) => {
    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Academic Calendar' })).toBeVisible();
    
    await page.getByRole('button', { name: 'Add Event' }).click();
    
    // Inputs don't have associated labels, so we select by type within the fixed modal
    await page.locator('.fixed input[type="text"]').first().fill('Test Holiday');
    
    // There are 2 date inputs, we can just grab them by type
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.nth(0).fill('2026-08-01');
    await dateInputs.nth(1).fill('2026-08-02');
    
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByText('Event added successfully')).toBeVisible();
    await expect(page.getByText('Test Holiday').first()).toBeVisible();
  });
});
