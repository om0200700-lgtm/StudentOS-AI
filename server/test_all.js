const API_URL = 'http://localhost:5000/api';

const runAllTests = async () => {
  try {
    console.log('--- Starting Complete Integration Test (Phases 1-7) ---');
    
    // 1. Auth Register & Login (Phase 2)
    console.log('1. Testing Auth...');
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Integration Test User', email: 'testuser1@example.com', password: 'password123', college: 'Test', branch: 'CS', semester: 4 })
    });
    
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser1@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) throw new Error('Auth Failed');
    const token = loginData.token;
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    console.log('✅ Auth successful.');

    // 2. Dashboard Analytics (Phase 3)
    console.log('2. Testing Dashboard Analytics...');
    const dashRes = await fetch(`${API_URL}/analytics/dashboard`, { headers });
    const dashData = await dashRes.json();
    if (!dashData.data.studyHoursData.labels) throw new Error('Dashboard Data Corrupted');
    console.log('✅ Dashboard Analytics successful.');

    // 3. Attendance (Phase 4)
    console.log('3. Testing Attendance...');
    const attRes = await fetch(`${API_URL}/attendance`, { headers });
    if (attRes.status !== 200) throw new Error('Attendance API Failed');
    console.log('✅ Attendance successful.');

    // 4. CGPA (Phase 5)
    console.log('4. Testing CGPA...');
    const cgpaRes = await fetch(`${API_URL}/cgpa`, { headers });
    if (cgpaRes.status !== 200) throw new Error('CGPA API Failed');
    console.log('✅ CGPA successful.');

    // 5. Planner (Phase 6)
    console.log('5. Testing Study Planner...');
    const plannerRes = await fetch(`${API_URL}/planner/tasks`, { headers });
    if (plannerRes.status !== 200) throw new Error('Planner API Failed');
    console.log('✅ Study Planner successful.');

    // 6. Coding Profile (Phase 7)
    console.log('6. Testing Coding Profile...');
    const codingRes = await fetch(`${API_URL}/coding`, { headers });
    const codingData = await codingRes.json();
    if (codingRes.status !== 200 || !codingData.data) throw new Error('Coding API Failed');
    console.log('✅ Coding Profile successful.');

    // 7. Placement Prep (Phase 7)
    console.log('7. Testing Placement Readiness...');
    const placementRes = await fetch(`${API_URL}/placement`, { headers });
    const placementData = await placementRes.json();
    if (placementRes.status !== 200 || !placementData.data) throw new Error('Placement API Failed');
    console.log('✅ Placement Readiness successful.');

    // 8. Testing Phase 8 (Profile & Goals)
    console.log('8. Testing Phase 8 (Profile & Goals)...');
    await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ skills: ['React', 'Node'], interests: ['AI', 'Web Dev'] })
    });
    const goalRes = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title: 'Finish Phase 8', category: 'Academic' })
    });
    const goalData = await goalRes.json();
    if (!goalData.success) throw new Error('Goals API Failed');
    console.log('✅ Phase 8 Profile & Goals successful.');

    console.log('--- ALL PHASES INTEGRATION TESTS PASSED ---');
  } catch (error) {
    console.error('❌ Integration Test Failed:', error.message);
    process.exit(1);
  }
};

runAllTests();
