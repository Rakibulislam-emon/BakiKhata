const { chromium } = require('playwright');

(async () => {
  console.log('Starting Playwright test...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });
  
  try {
    // Navigate to the app
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Check if key elements are present
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for main heading
    const heading = await page.textContent('h1');
    console.log('Main heading:', heading);
    
    // Check for key UI elements
    const addButton = await page.$('button:has-text("নতুন গ্রাহক যোগ করুন")');
    console.log('Add button found:', !!addButton);
    
    const searchInput = await page.$('input[placeholder*="গ্রাহকের নাম"]');
    console.log('Search input found:', !!searchInput);
    
    // Report console messages
    console.log('\n--- Console Messages ---');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
    });
    
    // Report errors
    if (consoleErrors.length > 0) {
      console.log('\n--- Console Errors ---');
      consoleErrors.forEach(err => console.log('ERROR:', err));
      process.exit(1);
    } else {
      console.log('\n✓ No console errors detected!');
    }
    
    console.log('\n✓ Playwright test passed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
