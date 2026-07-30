// Unit tests for Attendance logic
const assert = require('assert');

const getPercentage = (attended, total) => total === 0 ? 0 : Math.round((attended / total) * 100);

const calculateClassesNeeded = (attended, total, target) => {
  const targetDec = target / 100;
  if (getPercentage(attended, total) >= target) return 0;
  const needed = (targetDec * total - attended) / (1 - targetDec);
  return Math.ceil(needed);
};

const calculateCanBunk = (attended, total, target) => {
  const targetDec = target / 100;
  if (getPercentage(attended, total) <= target) return 0;
  const bunk = (attended / targetDec) - total;
  return Math.floor(bunk);
};

try {
  // Scenario 1: Exactly at target
  assert.strictEqual(getPercentage(75, 100), 75);
  assert.strictEqual(calculateClassesNeeded(75, 100, 75), 0);
  assert.strictEqual(calculateCanBunk(75, 100, 75), 0);

  // Scenario 2: Below target (needs classes)
  // Attended 50 out of 100 = 50%. Target = 75%.
  // Need to reach 75%. Formula says needed = (0.75 * 100 - 50) / 0.25 = 25 / 0.25 = 100.
  // Check: (50 + 100) / (100 + 100) = 150/200 = 75%. Correct!
  assert.strictEqual(calculateClassesNeeded(50, 100, 75), 100);
  
  // Scenario 3: Above target (can bunk)
  // Attended 90 out of 100 = 90%. Target = 75%.
  // bunk = (90 / 0.75) - 100 = 120 - 100 = 20.
  // Check: 90 / (100 + 20) = 90/120 = 75%. Correct!
  assert.strictEqual(calculateCanBunk(90, 100, 75), 20);

  console.log('✅ All attendance math calculations are CORRECT!');
} catch (error) {
  console.error('❌ Math calculation failed:', error);
  process.exit(1);
}
