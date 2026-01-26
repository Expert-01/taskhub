#!/usr/bin/env node

/**
 * Test script for TaskHub Authentication Backend
 * Tests the auth endpoints
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    confirmPassword: 'TestPassword123'
};

let authToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && { 'Authorization': `Bearer ${authToken}` })
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsedBody });
                } catch {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

// Test functions
async function testSignup() {
    console.log('\n📝 Testing Signup...');
    try {
        const result = await makeRequest('POST', '/api/auth/signup', testUser);
        
        if (result.status === 201 && result.body.success) {
            authToken = result.body.data.token;
            console.log('✅ Signup successful');
            console.log(`   User: ${result.body.data.user.email}`);
            console.log(`   Token: ${authToken.substring(0, 20)}...`);
            return true;
        } else {
            console.log('❌ Signup failed:', result.body.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Error during signup:', error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n🔐 Testing Login...');
    try {
        const result = await makeRequest('POST', '/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        
        if (result.status === 200 && result.body.success) {
            authToken = result.body.data.token;
            console.log('✅ Login successful');
            console.log(`   User: ${result.body.data.user.email}`);
            console.log(`   Token: ${authToken.substring(0, 20)}...`);
            return true;
        } else {
            console.log('❌ Login failed:', result.body.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Error during login:', error.message);
        return false;
    }
}

async function testVerifyToken() {
    console.log('\n🔍 Testing Token Verification...');
    try {
        const result = await makeRequest('POST', '/api/auth/verify-token', {
            token: authToken
        });
        
        if (result.status === 200 && result.body.success) {
            console.log('✅ Token verification successful');
            console.log(`   User: ${result.body.data.user.email}`);
            return true;
        } else {
            console.log('❌ Token verification failed:', result.body.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Error during token verification:', error.message);
        return false;
    }
}

async function testGetMe() {
    console.log('\n👤 Testing Get Current User...');
    try {
        const result = await makeRequest('GET', '/api/auth/me');
        
        if (result.status === 200 && result.body.success) {
            console.log('✅ Get user successful');
            console.log(`   User: ${result.body.data.user.email}`);
            return true;
        } else {
            console.log('❌ Get user failed:', result.body.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Error getting user:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Starting TaskHub Auth Backend Tests...');
    console.log('==========================================');
    
    // Wait a bit for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = [];
    
    results.push(await testSignup());
    if (!results[0]) {
        console.log('\n⚠️  Skipping remaining tests as signup failed');
        process.exit(1);
    }
    
    results.push(await testLogin());
    results.push(await testVerifyToken());
    results.push(await testGetMe());
    
    console.log('\n==========================================');
    console.log('📊 Test Results:');
    console.log(`   ✅ Passed: ${results.filter(r => r).length}/${results.length}`);
    
    if (results.every(r => r)) {
        console.log('\n🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed');
        process.exit(1);
    }
}

runTests().catch(error => {
    console.error('🔴 Test suite error:', error);
    process.exit(1);
});
