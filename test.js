// test.js - Improved test script to verify the /me endpoint
import axios from 'axios';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT_MS = 5000;
const HEALTH_POLL_RETRIES = 5;
const HEALTH_POLL_INTERVAL = 500; // ms

function isISO8601(value) {
  if (!value || typeof value !== 'string') return false;
  // quick parse check
  const t = Date.parse(value);
  return !Number.isNaN(t) && value.includes('T') && value.includes('Z');
}

async function waitForHealth() {
  for (let i = 0; i < HEALTH_POLL_RETRIES; i++) {
    try {
      const res = await axios.get(`${BASE_URL}/health`, { timeout: TIMEOUT_MS });
      if (res.status === 200) return;
    } catch (_) {
      // ignore and retry
    }
    await new Promise(r => setTimeout(r, HEALTH_POLL_INTERVAL));
  }
  throw new Error(`Server at ${BASE_URL} did not become healthy`);
}

async function testMeEndpoint() {
  console.log('🧪 Testing /me endpoint at', BASE_URL);

  await waitForHealth();

  try {
    const response = await axios.get(`${BASE_URL}/me`, { timeout: TIMEOUT_MS, validateStatus: () => true });

    // Accept both 200 (success) and 4xx/5xx (error) responses and assert shape accordingly
    const data = response.data;
    console.log('HTTP', response.status);

    if (response.status === 200) {
      // successful response shape
      assert.equal(data.status, 'success', 'expected status to be "success"');
      assert.ok(data.user && typeof data.user === 'object', 'expected user object');
      assert.ok(data.user.email, 'expected user.email');
      assert.ok(data.user.name, 'expected user.name');
      assert.ok(data.user.stack, 'expected user.stack');
      assert.ok(isISO8601(data.timestamp), 'expected timestamp to be ISO 8601');
      assert.ok(typeof data.fact === 'string' && data.fact.length > 0, 'expected non-empty fact');

      // dynamic behavior: consecutive requests may differ but should be present
      const r2 = await axios.get(`${BASE_URL}/me`, { timeout: TIMEOUT_MS });
      assert.ok(r2.data.timestamp, 'second request has timestamp');

      console.log('✅ /me success response validated');
    } else {
      // error response shape (as requested): only minimal fields
      assert.equal(data.status, 'error', 'expected status to be "error"');
      assert.equal(data.message, 'Failed to fetch profile data', 'expected failure message');
      assert.ok(typeof data.error === 'string' && data.error.length > 0, 'expected error string');

      // ensure user and other profile fields are NOT present on error response
      assert.ok(!('user' in data), 'error response should not include user');
      assert.ok(!('timestamp' in data), 'error response should not include timestamp');
      assert.ok(!('fact' in data), 'error response should not include fact');

      console.log('✅ /me error response shape validated');
    }

    console.log('\n✨ All tests passed');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed:');
    if (err instanceof assert.AssertionError) {
      console.error('Assertion failed:', err.message);
    } else {
      console.error(err && err.message ? err.message : err);
    }
    process.exit(1);
  }
}

// Run tests
console.log('Make sure the server is running...');
testMeEndpoint();