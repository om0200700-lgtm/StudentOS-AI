const fs = require('fs');
const path = require('path');
const dir = 'tests/e2e';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const\s+\{\s*test,\s*expect\s*\}\s*=\s*require\('@playwright\/test'\);/g, "import { test, expect } from '@playwright/test';");
    // Also handle const { something } = require('...') if needed
    content = content.replace(/const\s+(\w+)\s*=\s*require\('([^']+)'\);/g, "import $1 from '$2';");
    // Handle module.exports
    content = content.replace(/module\.exports\s*=/g, "export default");
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}
