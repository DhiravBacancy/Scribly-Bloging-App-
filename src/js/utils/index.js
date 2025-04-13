// utils.js
function redirectIfNotAuthenticated() {
    if (!AuthService.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }
  
  function redirectIfAuthenticated() {
    if (AuthService.isAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }