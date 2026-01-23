// Check if user is authenticated on page load
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // If no token, redirect to login
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    // Fetch user data from protected endpoint
    const response = await fetch('http://localhost:4000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
      }
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();

    // Update welcome message with user name
    const welcomeMessage = document.getElementById('welcomeMessage');
    const displayName = userData.name || userData.email.split('@')[0];
    welcomeMessage.textContent = `Hi, ${displayName} `;

  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Optionally redirect to login on error
    // window.location.href = 'login.html';
  }
});

// Logout function (can be called from navigation)
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Optional: Add logout button to sidebar
const navItems = document.querySelectorAll('nav a');
if (navItems.length > 0) {
  const lastNav = navItems[navItems.length - 1];
  if (lastNav.textContent === 'Settings') {
    const logoutBtn = document.createElement('a');
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.color = '#ff4757';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener('click', logout);
    lastNav.parentElement.appendChild(logoutBtn);
  }
}
