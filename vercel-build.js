#!/usr/bin/env node
/**
 * Vercel Build Script
 * This script injects the backend API URL into the frontend configuration
 * during the Vercel build process
 */

const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000';
const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  console.warn(`⚠️  Public directory not found at ${publicDir}`);
  process.exit(0);
}

// Create a config file with backend URL injected
const configContent = `
// Auto-generated file - Backend API configuration injected by build process
// This file is created during deployment to inject the backend URL
window.__BACKEND_API__ = '${backendUrl}';
console.log('[TaskHub] Backend API URL injected:', window.__BACKEND_API__);
`;

try {
  const outputPath = path.join(publicDir, 'env-config.js');
  fs.writeFileSync(outputPath, configContent);
  console.log(`✅ Backend API URL injected: ${backendUrl}`);
  console.log(`✅ Created: ${outputPath}`);
} catch (error) {
  console.error(`❌ Error creating env-config.js: ${error.message}`);
  process.exit(1);
}
