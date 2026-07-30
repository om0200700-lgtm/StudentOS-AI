import { test, expect } from '@playwright/test';
import { loginAs } from './testUtils';

test.describe('RBAC (Role Based Access Control)', () => {

  test('Student should not access Admin Dashboard', async ({ page }) => {
    await loginAs(page, 'student@test.com', 'password123', '**/dashboard**');
    
    // Attempt to navigate to admin routes
    await page.goto('/admin');
    
    // The application should either redirect to dashboard or show unauthorized
    // Our RoleBasedRedirect component should redirect to /dashboard
    await page.waitForURL('**/dashboard**');
    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
  });

  test('Faculty should not access Admin Dashboard', async ({ page }) => {
    await loginAs(page, 'faculty@test.com', 'password123', '**/faculty**');
    
    // Attempt to navigate to admin routes
    await page.goto('/admin');
    
    // Should redirect to faculty dashboard
    await page.waitForURL('**/faculty**');
    await expect(page.locator('h1').filter({ hasText: 'Faculty Dashboard' })).toBeVisible();
  });

  test('Student should not access Faculty Dashboard', async ({ page }) => {
    await loginAs(page, 'student@test.com', 'password123', '**/dashboard**');
    
    // Attempt to navigate to faculty routes
    await page.goto('/faculty');
    
    // Should redirect to student dashboard
    await page.waitForURL('**/dashboard**');
  });

  test('admin can access both faculty and student areas', async ({ page }) => {
    await loginAs(page, 'admin@test.com', 'password123', '**/admin**');
    
    // Admin is allowed in both areas due to ProtectedRoute configs
    await page.goto('/faculty');
    await page.waitForURL('**/faculty**');
    await expect(page.locator('h1').filter({ hasText: 'Faculty Dashboard' })).toBeVisible();

    await page.goto('/admin');
    await page.waitForURL('**/admin**');
  });
});
