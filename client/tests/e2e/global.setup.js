export default async function globalSetup() {
  console.log('Seeding test database...');
  let retries = 15;
  let success = false;
  
  while (retries > 0 && !success) {
    try {
      // Wait for the backend to be ready, then seed it
      const response = await fetch('http://localhost:5000/api/test/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        success = true;
      }
    } catch (err) {
      // Wait and retry if connection refused
    }
    
    if (!success) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries--;
    }
  }

  if (!success) {
    console.error('Failed to seed test database via API. Backend might not be running or connected.');
    throw new Error('Seed failed');
  }

  console.log('Test database seeded successfully.');
}
