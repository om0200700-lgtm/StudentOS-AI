const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const report = {
    errors: [],
    failedRequests: [],
    pagesVisited: [],
    consoleLogs: []
  };

  page.on('console', msg => {
    if(msg.type() === 'error') report.errors.push(msg.text());
    report.consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    report.errors.push(`PAGE ERROR: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    report.failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    console.log('Navigating to register...');
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
    report.pagesVisited.push('/register');

    console.log('Registering a new account...');
    const uniqueEmail = `test_${Date.now()}@test.com`;
    const inputs = await page.$$('input');
    await inputs[0].type('Test User');
    await inputs[1].type(uniqueEmail);
    await inputs[2].type('password123');
    await inputs[3].type('password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Registered and navigated to:', page.url());
    report.pagesVisited.push('/dashboard');

    const pagesToTest = [
      'attendance',
      'cgpa',
      'planner',
      'coding',
      'placement',
      'assistant',
      'analytics',
      'roadmap',
      'profile',
      'settings'
    ];

    for (const p of pagesToTest) {
      console.log(`Navigating to /dashboard/${p}...`);
      await page.goto(`http://localhost:5173/dashboard/${p}`, { waitUntil: 'networkidle2' });
      
      // Wait for any animations and data fetching
      await new Promise(r => setTimeout(r, 2000));
      
      const content = await page.content();
      if (content.includes('Loading...')) {
        report.errors.push(`Page /dashboard/${p} is stuck on loading state.`);
      }
      
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText || bodyText.trim().length < 50) {
        report.errors.push(`Page /dashboard/${p} seems to be blank.`);
      }
      
      report.pagesVisited.push(`/dashboard/${p}`);
    }
    
    console.log('Navigating to logout...');
    // Finding the avatar and clicking logout
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    
    // We'll just write the report out now
  } catch (e) {
    report.errors.push(`SCRIPT CRASH: ${e.message}`);
  } finally {
    fs.writeFileSync('test_report.json', JSON.stringify(report, null, 2));
    await browser.close();
    console.log('Test complete. Report saved to test_report.json');
  }
})();
