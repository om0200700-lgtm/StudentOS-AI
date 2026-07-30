import { test, expect } from '@playwright/test';
import { loginAs } from './testUtils';

test.describe('Faculty Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'faculty@test.com', 'password123', '**/faculty**');
  });

  test('should load Faculty Dashboard', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Faculty Dashboard' })).toBeVisible();
    await expect(page.getByText('Assigned Subjects')).toBeVisible();
    await expect(page.getByText('My Classes')).toBeVisible();
  });

  test('should navigate to Subjects', async ({ page }) => {
    await page.getByRole('link', { name: 'Subjects' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Subjects' })).toBeVisible();
  });

  test('should navigate to Attendance', async ({ page }) => {
    await page.getByRole('link', { name: 'Attendance' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Class Attendance' })).toBeVisible();
  });

  test('should navigate to Marks', async ({ page }) => {
    await page.getByRole('link', { name: 'Marks' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Marks & Grades' })).toBeVisible();
  });

  test('should navigate to Notices', async ({ page }) => {
    await page.getByRole('link', { name: 'Notices' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Notice Board' })).toBeVisible();
  });
});
