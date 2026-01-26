// API Configuration with fallback support
const API_CONFIG = {
  // Get the API base URL from environment or use fallback
  getBaseUrl: function() {
    // Priority order for API URL detection:
    // 1. Check if BACKEND_API_URL is globally defined (Vercel injected)
    if (typeof BACKEND_API_URL !== 'undefined' && BACKEND_API_URL) {
      return BACKEND_API_URL;
    }
    
    // 2. Check if window.__BACKEND_API__ is set (env-config.js injected)
    if (window.__BACKEND_API__) {
      return window.__BACKEND_API__;
    }
    
    // 3. Check URL parameters for local override: ?local=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('local') === 'true') {
      return 'http://localhost:4000';
    }
    
    // 4. If running on localhost and no local parameter, check for local backend
    const hostname = window.location.hostname;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && !urlParams.get('local')) {
      // Default local development to local backend
      return 'http://localhost:4000';
    }
    
    // 5. Default to production backend for all other cases
    return 'https://taskhub-rsu-api.onrender.com';
  }
};

// Make it globally available
window.API_BASE_URL = API_CONFIG.getBaseUrl();

// Debug: log which API URL is being used
console.log(`[TaskHub] Using API endpoint: ${window.API_BASE_URL}`);

