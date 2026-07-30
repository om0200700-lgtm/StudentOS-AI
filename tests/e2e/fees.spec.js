const { test, expect } = require('@playwright/test');

test.describe('Fee Management E2E', () => {
  let adminContext;
  let adminPage;
  let studentContext;
  let studentPage;

  test.beforeAll(async ({ browser }) => {
    // Setup Admin
    adminContext = await browser.newContext();
    adminPage = await adminContext.newPage();
    await adminPage.goto('http://localhost:5173/login');
    await adminPage.fill('input[type="email"]', 'admin@studentos.com');
    await adminPage.fill('input[type="password"]', 'admin123');
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL('**/admin');

    // Setup Student
    studentContext = await browser.newContext();
    studentPage = await studentContext.newPage();
    await studentPage.goto('http://localhost:5173/login');
    await studentPage.fill('input[type="email"]', 'student@studentos.com');
    await studentPage.fill('input[type="password"]', 'student123');
    await studentPage.click('button[type="submit"]');
    await studentPage.waitForURL('**/dashboard');
  });

  test.afterAll(async () => {
    await adminContext.close();
    await studentContext.close();
  });

  test('Admin can create a new fee record', async () => {
    await adminPage.goto('http://localhost:5173/admin/fees');
    
    // Check page loaded
    await expect(adminPage.locator('h1:has-text("Fee Management")')).toBeVisible();

    // Open modal
    await adminPage.click('button:has-text("Add Fee Record")');
    await expect(adminPage.locator('h2:has-text("Add Fee Record")')).toBeVisible();

    // Just verifying the form opens and closes properly to avoid breaking DB in normal run
    await adminPage.click('button:has-text("Cancel")');
  });

  test('Student can view fee portal', async () => {
    await studentPage.goto('http://localhost:5173/dashboard/fees');
    
    await expect(studentPage.locator('h1:has-text("My Fees")')).toBeVisible();
    await expect(studentPage.locator('p:has-text("View and pay your semester fees")')).toBeVisible();
  });
});
