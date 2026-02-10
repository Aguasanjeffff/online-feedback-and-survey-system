<template>
  <div class="auth-container">
    <div class="auth-card card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="formData.email" 
            type="email" 
            required 
            placeholder="Enter email"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="formData.password" 
            type="password" 
            required 
            placeholder="Enter password"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>

      <p class="auth-switch">
        Don't have an account? 
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../services/api';

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        const response = await authAPI.login(this.formData);
        
        // Save token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  max-width: 400px;
  width: 100%;
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #4f46e5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

button[type="submit"] {
  width: 100%;
  margin-top: 1rem;
}

.error-message {
  color: #ef4444;
  margin-top: 1rem;
  text-align: center;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
}

.auth-switch a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>