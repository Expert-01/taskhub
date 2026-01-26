# Vercel Frontend Deployment Guide

## Overview
This guide covers deploying the TaskHub frontend to Vercel while connecting to the backend running on Render.

## Prerequisites
- Frontend code pushed to GitHub
- Backend deployed on Render: `https://taskhub-rsu-api.onrender.com`
- Vercel account connected to GitHub

## Step 1: Import Project on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository

## Step 2: Configure Project Settings

### Build Settings
- **Framework Preset**: Other (we're serving static HTML/JS)
- **Build Command**: (Leave empty - no build step needed)
- **Output Directory**: `public`
- **Install Command**: (Leave empty)

### Root Directory
- Set to: `./` (root of repository)

## Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
BACKEND_API_URL=https://taskhub-rsu-api.onrender.com
```

Then update your `vercel.json` configuration file (create if doesn't exist):

```json
{
  "buildCommand": "",
  "outputDirectory": "public",
  "env": {
    "BACKEND_API_URL": "@backend_api_url"
  },
  "functions": {
    "api/**/*.js": {
      "memory": 128,
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "${BACKEND_API_URL}/api/health"
    },
    {
      "source": "/api/:path*",
      "destination": "${BACKEND_API_URL}/api/:path*"
    }
  ]
}
```

## Step 4: Inject Backend URL into Frontend

Create a `vercel-build.js` file in the root directory:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000';
const publicDir = path.join(__dirname, 'public');

// Create a config file with backend URL injected
const configContent = `
// Injected backend API configuration
window.__BACKEND_API__ = '${backendUrl}';
`;

fs.writeFileSync(
  path.join(publicDir, 'env-config.js'),
  configContent
);

console.log(`✓ Backend API URL injected: ${backendUrl}`);
```

## Step 5: Update HTML Files to Load Env Config

Update each HTML file to include the injected config BEFORE `config.js`:

For example, in `public/login.html`:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - TaskHub RSU</title>
    <link rel="stylesheet" href="auth.css">
    <link rel="stylesheet" href="style.css">
    <!-- Injected environment config (production only) -->
    <script src="env-config.js"></script>
    <!-- Main config that uses window.__BACKEND_API__ -->
    <script src="config.js"></script>
</head>
```

Do this for all HTML files:
- `public/login.html`
- `public/signup.html`
- `public/dashboard.html`
- `public/index.html`
- `public/post-task.html`
- `public/task-detail.html`

## Step 6: Update package.json (Root Level)

If you have a root `package.json`, add the build script:

```json
{
  "scripts": {
    "build": "node vercel-build.js"
  }
}
```

Or in Vercel dashboard, set:
- **Build Command**: `node vercel-build.js`

## Step 7: Configure CORS on Backend

Ensure your backend `.env` has:
```
FRONTEND_URL=https://taskhub-alpha.vercel.app
```

And backend `server.js` uses it (already configured):
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

## Step 8: Deploy

1. Push all changes to GitHub
2. Vercel will automatically deploy
3. Check build logs for any errors

## Testing Deployment

### 1. Check Frontend Loads
```bash
curl https://taskhub-alpha.vercel.app/login.html
```

### 2. Check Backend URL is Injected
Open browser DevTools Console and run:
```javascript
console.log(window.__BACKEND_API__);  // Should output backend URL
console.log(window.API_BASE_URL);    // Should be backend URL
```

### 3. Test API Calls
Try login:
```javascript
fetch(`${window.API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
}).then(r => r.json()).then(console.log);
```

### 4. Check CORS Headers
In browser Network tab, look for:
```
Access-Control-Allow-Origin: https://taskhub-alpha.vercel.app
```

## Troubleshooting

### CORS Errors
**Problem**: "Cross-Origin Request Blocked"

**Solution**:
1. Check `FRONTEND_URL` is correct in backend `.env`
2. Check backend is using it in CORS config
3. Verify `window.API_BASE_URL` is correct in browser console

### 404 on API Calls
**Problem**: Frontend can't reach backend

**Solution**:
1. Check `window.__BACKEND_API__` in console
2. Verify backend URL is accessible: `curl https://taskhub-rsu-api.onrender.com/api/health`
3. Check network tab for actual URL being called

### env-config.js Not Found
**Problem**: Console shows 404 for `env-config.js`

**Solution**:
1. Make sure Vercel build command runs `vercel-build.js`
2. Check `vercel-build.js` creates file in `public/` directory
3. Verify `env-config.js` is in build output

### API_BASE_URL is localhost
**Problem**: Frontend still using localhost URL

**Solution**:
1. Check `env-config.js` was generated with correct URL
2. Verify HTML has `<script src="env-config.js"></script>` BEFORE `config.js`
3. Hard refresh browser (Ctrl+Shift+R)

## Environment Variables

### Vercel Dashboard Settings
Set these in Vercel → Settings → Environment Variables:

| Variable | Value | 
|----------|-------|
| `BACKEND_API_URL` | `https://taskhub-rsu-api.onrender.com` |

### Backend (.env on Render)
```
FRONTEND_URL=https://taskhub-alpha.vercel.app
BACKEND_API=https://taskhub-rsu-api.onrender.com
```

## Rollback

If deployment breaks:
1. Go to Vercel Dashboard
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Configure backend CORS for Vercel domain
3. ✅ Test API connectivity
4. ✅ Monitor Render backend performance
5. ✅ Set up error tracking (Sentry, LogRocket, etc.)
