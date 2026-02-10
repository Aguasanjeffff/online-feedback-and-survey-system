<template>
  <div id="app">
    <!-- Only show navbar for logged in users, NOT for public survey -->
    <nav v-if="isLoggedIn && !isPublicSurvey" class="navbar">
      <div class="nav-container">
        <router-link to="/dashboard" class="logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">Survey System</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <span class="nav-icon">📂</span>
            Dashboard
          </router-link>
          <router-link to="/survey/create" class="nav-link">
            <span class="nav-icon">➕</span>
            Create Survey
          </router-link>
          <button @click="logout" class="logout-btn">
            <span class="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
    
    <main :class="{ 'public-page': isPublicSurvey }">
      <router-view />
    </main>

    <!-- Footer for public pages -->
    <footer v-if="isPublicSurvey" class="public-footer">
      <p>Powered by Survey System</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    isPublicSurvey() {
      return this.$route.path.startsWith('/s/');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Dark Aesthetic Theme - Calm but not too dark */
  --bg-primary: #1a1d29;
  --bg-secondary: #22252f;
  --bg-tertiary: #2a2d3a;
  --bg-card: #252835;
  --bg-hover: #2d3142;
  
  --text-primary: #e4e6eb;
  --text-secondary: #b8bcc8;
  --text-muted: #8b92a8;
  
  --accent-primary: #6366f1;
  --accent-hover: #4f46e5;
  --accent-light: #818cf8;
  
  --success: #10b981;
  --success-light: #34d399;
  --danger: #ef4444;
  --danger-light: #f87171;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  --border: #3a3d4e;
  --shadow: rgba(0, 0, 0, 0.3);
  
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar Styles */
.navbar {
  background: var(--bg-secondary);
  box-shadow: 0 4px 12px var(--shadow);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  background: transparent;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-link.router-link-active {
  color: var(--accent-light);
  background: rgba(99, 102, 241, 0.1);
}

.nav-icon {
  font-size: 1.2rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.logout-btn:hover {
  background: var(--danger-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Main Content */
main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

main.public-page {
  max-width: 900px;
  padding: 3rem 2rem;
}

/* Buttons */
button, .btn {
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Elements */
input, textarea, select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: var(--bg-secondary);
}

input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}

/* Cards */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: 0 4px 12px var(--shadow);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px var(--shadow);
  border-color: rgba(99, 102, 241, 0.3);
}

/* Labels */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

/* Public Footer */
.public-footer {
  background: var(--bg-secondary);
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-hover);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  main {
    padding: 1.5rem 1rem;
  }
}
</style>