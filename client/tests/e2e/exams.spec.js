import { test, expect } from '@playwright/test';

test.describe('Exam Management E2E', () => {
  let adminContext;
  let adminPage;
  let studentContext;
  let studentPage;

  test.beforeAll(async ({ browser }) => {
    // Setup Admin
    adminContext = await browser.newContext();
    adminPage = await adminContext.newPage();
    await adminPage.goto('http://localhost:5173/login');
    await adminPage.fill('input[type="email"]', 'admin@test.com');
    await adminPage.fill('input[type="password"]', 'password123');
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL('**/admin');

    // Setup Student
    studentContext = await browser.newContext();
    studentPage = await studentContext.newPage();
    await studentPage.goto('http://localhost:5173/login');
    await studentPage.fill('input[type="email"]', 'student@test.com');
    await studentPage.fill('input[type="password"]', 'password123');
    await studentPage.click('button[type="submit"]');
    await studentPage.waitForURL('**/dashboard');
  });

  test.afterAll(async () => {
    await adminContext.close();
    await studentContext.close();
  });

  test('Admin can view exam management', async () => {
    await adminPage.goto('http://localhost:5173/admin/exams');
    
    // Check page loaded
    await expect(adminPage.locator('h1:has-text("Examination Management")')).toBeVisible();

    // Open modal
    await adminPage.click('button:has-text("Schedule Exam")');
    await expect(adminPage.locator('h2:has-text("Schedule New Exam")')).toBeVisible();

    await adminPage.click('button:has-text("Cancel")');
  });

  test('Student can view results portal', async () => {
    await studentPage.goto('http://localhost:5173/dashboard/academics/results');
    
    await expect(studentPage.locator('h1:has-text("My Results")')).toBeVisible();
    await expect(studentPage.locator('p:has-text("View and download your official marksheets")')).toBeVisible();
  });
});
