import { test, expect } from '@playwright/test';
import { loginAs } from './testUtils';

test.describe('Authentication Flow', () => {

  test('should display login page and elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1').first()).toContainText('StudentOS AI');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button[type="submit"]');
    
    // The toast error should appear
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should login as admin and navigate to admin dashboard', async ({ page }) => {
    await loginAs(page, 'admin@test.com', 'password123', '**/admin**');
    await expect(page).toHaveURL(/.*\/admin.*/);
    await expect(page.locator('h1').filter({ hasText: 'Admin Dashboard' })).toBeVisible();
  });

  test('should login as student and navigate to dashboard', async ({ page }) => {
    await loginAs(page, 'student@test.com', 'password123', '**/dashboard**');
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
  });

  test('should login as faculty and navigate to dashboard', async ({ page }) => {
    await loginAs(page, 'faculty@test.com', 'password123', '**/faculty**');
    await expect(page).toHaveURL(/.*\/faculty/);
    await expect(page.locator('h1').filter({ hasText: 'Faculty Dashboard' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await loginAs(page, 'student@test.com', 'password123');
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Open user dropdown if mobile, otherwise just click logout
    const userMenuButton = page.locator('button:has(img)'); // Assuming avatar opens menu
    if (await userMenuButton.isVisible()) {
      await userMenuButton.click();
    }
    
    await page.getByText('Logout').click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
