# API Configuration Update

## Overview
The entire project has been updated to support dynamic API URL configuration using the `BACKEND_API` environment variable with automatic fallback to localhost for local development.

## Changes Made

### 1. **New Configuration File** (`public/config.js`)
- Creates a global `API_BASE_URL` variable
- Reads from `window.__BACKEND_API__` (set by deployment platform)
- Falls back to `http://localhost:4000` if not set
- This allows seamless switching between production and local development

### 2. **Updated Frontend Files**

All HTML files now include the config script at the top:
- `login.html` - Login page
- `signup.html` - Signup page
- `dashboard.html` - Dashboard page
- `index.html` - Home page
- `task-detail.html` - Task details page
- `post-task.html` - Post task page

### 3. **Updated API Calls**

Replaced hardcoded URLs with dynamic configuration:

**Before:**
```javascript
fetch('http://localhost:4000/api/auth/login', {...})
```

**After:**
```javascript
fetch(`${window.API_BASE_URL}/api/auth/login`, {...})
```

### 4. **Environment Configuration** (.env)

```dotenv
# Backend API URL for frontend to use
# Set this to your deployed backend URL (e.g., https://taskhub-rsu-api.onrender.com)
# Frontend will use this URL in production, or fallback to http://localhost:4000 in development
BACKEND_API=https://taskhub-rsu-api.onrender.com
```

## How It Works

### Local Development
1. Frontend loads and runs `config.js`
2. `window.__BACKEND_API__` is undefined
3. Falls back to `http://localhost:4000`
4. All API calls use the local backend

### Production (Render/Similar)
1. Deploy instructions inject `BACKEND_API` into HTML or via environment
2. Frontend loads `config.js` which reads `window.__BACKEND_API__`
3. Uses the production URL: `https://taskhub-rsu-api.onrender.com`
4. All API calls use the production backend

## For Deployment

To make this work on Render or similar platforms:

### Option 1: Environment Variable Injection (Recommended)
Add to your deployment script or build process:
```bash
# In build step
echo "window.__BACKEND_API__ = '${BACKEND_API}';" > public/env-config.js
```

Then add to your HTML files before config.js:
```html
<script src="env-config.js"></script>
<script src="config.js"></script>
```

### Option 2: Server-Side Rendering
If using a Node.js server to serve the frontend, inject the URL:
```javascript
app.get('*.html', (req, res) => {
  const html = fs.readFileSync(req.path)
    .toString()
    .replace('{{BACKEND_API}}', process.env.BACKEND_API);
  res.send(html);
});
```

### Option 3: Simple Manual Update
Directly update the `config.js` file for production:
```javascript
const API_CONFIG = {
  getBaseUrl: function() {
    return 'https://taskhub-rsu-api.onrender.com';
  }
};
window.API_BASE_URL = API_CONFIG.getBaseUrl();
```

## Testing

### Local Testing
1. Backend running on `http://localhost:4000`
2. Frontend automatically uses this URL
3. All features work as before

### Production Testing
1. Set `BACKEND_API` environment variable
2. Ensure frontend is served from the same domain as backend
3. Or configure CORS in backend to allow cross-origin requests

## Files Modified

```
public/
├── config.js (NEW)
├── login.html (MODIFIED)
├── signup.html (MODIFIED)
├── dashboard.html (MODIFIED)
├── index.html (MODIFIED)
├── task-detail.html (MODIFIED)
├── post-task.html (MODIFIED)
└── dashboard.js (MODIFIED)

backend/
└── .env (MODIFIED - added documentation)
```

## API Endpoints Updated

- `POST /api/auth/login` (login.html)
- `POST /api/auth/signup` (signup.html)
- `GET /api/user` (dashboard.js)

All now use `${window.API_BASE_URL}` prefix instead of hardcoded `http://localhost:4000`.
