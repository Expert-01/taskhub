// API Configuration with fallback support
const API_CONFIG = {
  // Get the API base URL from environment or use fallback
  getBaseUrl: function() {
    // Check if BACKEND_API is available (injected by build system or server)
    // Priority order:
    // 1. window.__BACKEND_API__ (set by server or build process)
    // 2. Environment variable (Vercel injected)
    // 3. Hostname-based detection (for same-domain deployments)
    // 4. Local fallback (development)
    
    if (window.__BACKEND_API__) {
      return window.__BACKEND_API__;
    }
    
    // Production: Use same domain if on production hostname
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Replace 'vercel.app' or other frontend domain with backend domain
      const hostname = window.location.hostname;
      
      // If frontend is taskhub-alpha.vercel.app, use the backend URL
      // This should be injected via environment variable instead
      if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        // For Vercel: backend URL should be in environment variable
        // Check for it in global scope
        if (typeof BACKEND_API_URL !== 'undefined') {
          return BACKEND_API_URL;
        }
      }
    }
    
    // Fallback to local API for development
    return 'http://localhost:4000';
  }
};

// Make it globally available
window.API_BASE_URL = API_CONFIG.getBaseUrl();

// Debug: log which API URL is being used
console.log(`[TaskHub] Using API endpoint: ${window.API_BASE_URL}`);
