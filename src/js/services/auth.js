class AuthService {
  static getUsers() {
      try {
          return JSON.parse(localStorage.getItem('users')) || [];
      } catch (e) {
          console.error("Error parsing users", e);
          return [];
      }
  }

  static getCurrentUser() {
      try {
          const data = localStorage.getItem('currentUser');
          if (!data) return null;
          
          const { user, expiry } = JSON.parse(data);
          if (expiry && expiry > Date.now()) {
              return user;
          }
          this.logout(); // Clear expired session
          return null;
      } catch (e) {
          console.error("Error parsing currentUser", e);
          return null;
      }
  }

  static setCurrentUser(user) {
      const userWithExpiry = {
          user: user,
          expiry: Date.now() + 3600000 // 1 hour
      };
      localStorage.setItem('currentUser', JSON.stringify(userWithExpiry));
  }

  static login(email, password) {
      if (!this.validateEmail(email)) {
          return { success: false, message: 'Invalid email format' };
      }

      const users = this.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
          return { success: false, message: 'User not found' };
      }

      // In real apps, compare hashed passwords!
      if (user.password !== password) {
          return { success: false, message: 'Incorrect password' };
      }

      this.setCurrentUser(user);
      return { success: true, user };
  }

  static logout() {
      localStorage.setItem('currentUser', JSON.stringify(null));
      window.location.href = '../pages/login.html';
  }

  static isAuthenticated() {
      return this.getCurrentUser() !== null;
  }

  static validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  static validatePassword(password) {
      // Stronger validation example:
      return password.length >= 8 
          && /[A-Z]/.test(password) 
          && /[0-9]/.test(password);
  }

  // Optional: Client-side password hashing (basic example)
  static hashPassword(pw) {
      // Note: In production, use proper hashing like bcrypt.js
      return pw.split('').reverse().join('') + pw.length;
  }

  static updateUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }
}