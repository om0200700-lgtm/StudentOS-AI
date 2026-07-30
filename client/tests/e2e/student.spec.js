import { test, expect } from '@playwright/test';
import { loginAs } from './testUtils';

test.describe('Student Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student@test.com', 'password123', '**/dashboard**');
  });

  test('should load Student Dashboard', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
    await expect(page.getByText('Current CGPA')).toBeVisible();
    await expect(page.getByText('Earned Credits')).toBeVisible();
    await expect(page.getByText('Today\'s Timetable')).toBeVisible();
  });

  test('should navigate to Timetable', async ({ page }) => {
    await page.getByRole('link', { name: 'Timetable' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Class Timetable' })).toBeVisible();
  });

  test('should navigate to Marks', async ({ page }) => {
    await page.getByRole('link', { name: 'Marks' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Marks & Grades' })).toBeVisible();
  });

  test('should navigate to Assignments', async ({ page }) => {
    await page.getByRole('link', { name: 'Assignments' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Assignments' })).toBeVisible();
  });
  
  test('should navigate to Class Attendance', async ({ page }) => {
    await page.getByRole('link', { name: 'Class Attendance' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Class Attendance' })).toBeVisible();
  });
});
