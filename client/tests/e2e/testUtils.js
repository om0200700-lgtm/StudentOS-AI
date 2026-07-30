import { expect } from '@playwright/test';

export async function loginAs(page, email, password, expectedUrl = '**/dashboard**') {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  if (expectedUrl) {
    // Rely on the test's expect(page).toHaveURL() instead to avoid "load" state hangs on SPA navigation
    await expect(page).toHaveURL(new RegExp(expectedUrl.replace(/\*/g, '.*')));
  }
}
