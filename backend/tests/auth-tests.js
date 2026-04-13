/**
 * Backend Authentication Tests
 * Tests for protected endpoints with invalid/missing tokens
 * 
 * Run with: node backend/tests/auth-tests.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5001';

// Test cases
const tests = [
  {
    name: 'Create review - NO TOKEN (should return 401)',
    method: 'POST',
    path: '/reviews/create',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      userId: 'test-user-123',
      userName: 'Test User',
      rating: 5,
      reviewText: 'This is a test review',
      mediaTitle: 'Test Movie',
      mediaType: 'movie',
    },
    expectedStatus: 401,
  },
  {
    name: 'Create review - INVALID TOKEN (should return 401)',
    method: 'POST',
    path: '/reviews/create',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid.token.here',
    },
    body: {
      userId: 'test-user-123',
      userName: 'Test User',
      rating: 5,
      reviewText: 'This is a test review',
      mediaTitle: 'Test Movie',
      mediaType: 'movie',
    },
    expectedStatus: 401,
  },
  {
    name: 'Create review - MALFORMED AUTH HEADER (should return 401)',
    method: 'POST',
    path: '/reviews/create',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'InvalidHeader',
    },
    body: {
      userId: 'test-user-123',
      userName: 'Test User',
      rating: 5,
      reviewText: 'This is a test review',
      mediaTitle: 'Test Movie',
      mediaType: 'movie',
    },
    expectedStatus: 401,
  },
  {
    name: 'Get reviews - NO TOKEN (should return 200 - public endpoint)',
    method: 'GET',
    path: '/reviews',
    headers: {
      'Content-Type': 'application/json',
    },
    expectedStatus: 200,
  },
];

// Run tests
async function runTests() {
  console.log('🧪 Starting Backend Authentication Tests\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await makeRequest(test);
      
      if (result.status === test.expectedStatus) {
        console.log(`✅ ${test.name}`);
        console.log(`   Expected: ${test.expectedStatus}, Got: ${result.status}\n`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Expected: ${test.expectedStatus}, Got: ${result.status}`);
        console.log(`   Response: ${JSON.stringify(result.body)}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

// Helper function to make HTTP requests
function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const url = new URL(test.path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: test.method,
      headers: test.headers || {},
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : null;
          resolve({
            status: res.statusCode,
            body: parsedBody,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body,
          });
        }
      });
    });

    req.on('error', reject);

    if (test.body) {
      req.write(JSON.stringify(test.body));
    }

    req.end();
  });
}

// Run the tests
runTests();
