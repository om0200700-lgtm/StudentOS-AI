import { test, expect } from '@playwright/test';

test.describe('AI Features E2E', () => {
  let studentContext;
  let studentPage;

  test.beforeAll(async ({ browser }) => {
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
    await studentContext.close();
  });

  test('Student can open AI Chatbot and send a message', async () => {
    await studentPage.goto('http://localhost:5173/dashboard');
    
    // Check chatbot button is visible
    const chatbotBtn = studentPage.locator('button', { hasText: '' }).filter({ has: studentPage.locator('svg') }).last();
    // In our implementation it's a fixed button at bottom right
    await studentPage.click('.fixed.bottom-6.right-6');

    // Wait for chat window to open
    await expect(studentPage.locator('h3:has-text("StudentOS AI")')).toBeVisible();

    // Send a message
    await studentPage.fill('input[placeholder="Ask me anything..."]', 'Hello, how do I check my GPA?');
    await studentPage.click('button[type="submit"]');

    // Expect some response or loading
    await expect(studentPage.locator('p:has-text("Hello, how do I check my GPA?")')).toBeVisible();
  });
});
