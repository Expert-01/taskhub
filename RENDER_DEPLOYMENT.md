# Render Deployment Configuration

This file contains instructions for deploying TaskHub on Render with proper API configuration.

## Setup on Render

### 1. Create a New Web Service on Render
- Connect your GitHub repository
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && npm start`

### 2. Environment Variables

Add these environment variables in Render dashboard:

```
BACKEND_API=https://your-render-domain.onrender.com
DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_jwt_secret
PGHOST=your_pg_host
PGPORT=5432
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGDATABASE=your_pg_database
```

### 3. Frontend Configuration for Production

The frontend needs to know the backend URL. You have two options:

#### Option A: Use Environment Variable (Recommended for Render)

1. In your Render service, add a build step to inject the API URL:

Edit your `start` command to include environment setup:
```bash
export API_URL=$BACKEND_API && cd backend && npm start
```

2. Modify `package.json` start script in backend to serve frontend with injected URL:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'window.__BACKEND_API__ = \"'$BACKEND_API'\";' > public/env-config.js"
  }
}
```

3. Update build command on Render:
```bash
cd backend && npm run build && npm install
```

#### Option B: Hardcode for Production (Simple)

Edit `public/config.js` for production:

```javascript
// For production, hardcode the API URL
const API_CONFIG = {
  getBaseUrl: function() {
    // Check environment
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000';
    }
    // Production URL
    return 'https://your-render-domain.onrender.com';
  }
};
```

### 4. CORS Configuration

Ensure your backend allows CORS requests from your frontend domain:

In `backend/server.js`, update CORS settings:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Add to environment variables:
```
FRONTEND_URL=https://your-frontend-domain.com
```

### 5. Deploy

1. Push to GitHub
2. Render will automatically deploy
3. Monitor build logs for any issues
4. Test API endpoints once deployment is complete

## Troubleshooting

### 404 Module Not Found Error
- Ensure `backend/package.json` has `"main": "server.js"`
- Ensure `backend/server.js` exists

### CORS Errors
- Check backend CORS configuration
- Verify frontend and backend domains are properly configured

### API Connection Failed
- Verify `BACKEND_API` environment variable is set correctly
- Check frontend's `public/config.js` for correct fallback URL
- Ensure backend service is running

## Local Development

For local development, the frontend automatically falls back to `http://localhost:4000`:

1. Start backend: `cd backend && npm start`
2. Open frontend: http://localhost:5000/public/index.html
3. All API calls will use the local backend

## Testing

### Test Login
```bash
curl -X POST https://your-render-domain.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### Test User Endpoint
```bash
curl -X GET https://your-render-domain.onrender.com/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Frontend Config
Open browser console and run:
```javascript
console.log(window.API_BASE_URL);
```

Should display: `https://your-render-domain.onrender.com`
