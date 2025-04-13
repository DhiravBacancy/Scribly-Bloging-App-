// login.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (AuthService.isAuthenticated()) {
      window.location.href = '../pages/dashboard.html';
      return;
    }
  
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        console.log(password);
        
        if (errorMessage) {
          errorMessage.style.display = 'none';
          errorMessage.textContent = '';
        }
  
        if (!AuthService.validateEmail(email)) {
          showError('Please enter a valid email address');
          return;
        }
  
        if (!AuthService.validatePassword(password)) {
          showError('Password must be at least 6 characters long');
          return;
        }
  
        const result = AuthService.login(email, password);
        if (result.success) {
          window.location.href = '../pages/dashboard.html';
        } else {
          showError(result.message || 'Invalid email or password');
        }
      });
    }
  
    function showError(message) {
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      } else {
        alert(message);
      }
    }
  });