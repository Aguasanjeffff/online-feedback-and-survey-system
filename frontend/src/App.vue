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
  /* 🎨 NEW AESTHETIC COLOR SCHEME - Modern Dark Theme with Purple/Blue Accent */
  
  /* Background Colors - Deep but not too dark */
  --bg-primary: #0f172a;        /* Slate 900 - Main background */
  --bg-secondary: #1e293b;      /* Slate 800 - Cards and navbar */
  --bg-tertiary: #334155;       /* Slate 700 - Input fields */
  --bg-card: #1e293b;           /* Card background */
  --bg-hover: #334155;          /* Hover states */
  
  /* Text Colors - High contrast for readability */
  --text-primary: #f1f5f9;      /* Slate 100 - Main text */
  --text-secondary: #cbd5e1;    /* Slate 300 - Secondary text */
  --text-muted: #94a3b8;        /* Slate 400 - Muted text */
  
  /* Accent Colors - Modern Purple/Blue gradient */
  --accent-primary: #8b5cf6;    /* Violet 500 - Primary accent */
  --accent-hover: #7c3aed;      /* Violet 600 - Hover state */
  --accent-light: #a78bfa;      /* Violet 400 - Light accent */
  --accent-gradient: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  
  /* Status Colors */
  --success: #10b981;           /* Emerald 500 */
  --success-light: #34d399;     /* Emerald 400 */
  --success-bg: rgba(16, 185, 129, 0.1);
  
  --danger: #ef4444;            /* Red 500 */
  --danger-light: #f87171;      /* Red 400 */
  --danger-bg: rgba(239, 68, 68, 0.1);
  
  --warning: #f59e0b;           /* Amber 500 */
  --warning-light: #fbbf24;     /* Amber 400 */
  --warning-bg: rgba(245, 158, 11, 0.1);
  
  --info: #3b82f6;              /* Blue 500 */
  --info-light: #60a5fa;        /* Blue 400 */
  --info-bg: rgba(59, 130, 246, 0.1);
  
  /* Border & Shadow */
  --border: #334155;            /* Slate 700 */
  --border-light: #475569;      /* Slate 600 */
  --shadow: rgba(0, 0, 0, 0.5);
  --shadow-colored: rgba(139, 92, 246, 0.3);
  
  /* Border Radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  /* Transitions */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar Styles */
.navbar {
  background: var(--bg-secondary);
  box-shadow: 0 4px 20px var(--shadow);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
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
  transition: var(--transition);
}

.logo:hover {
  transform: translateY(-2px);
  color: var(--accent-light);
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px var(--shadow-colored));
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
  transition: var(--transition);
  background: transparent;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--accent-gradient);
  opacity: 0;
  transition: var(--transition);
  z-index: -1;
}

.nav-link:hover {
  color: var(--text-primary);
  transform: translateY(-2px);
}

.nav-link:hover::before {
  opacity: 0.1;
}

.nav-link.router-link-active {
  color: var(--accent-light);
  background: var(--accent-bg);
}

.nav-link.router-link-active::before {
  opacity: 0.15;
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
  transition: var(--transition);
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.logout-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.logout-btn:hover::before {
  width: 300px;
  height: 300px;
}

.logout-btn:hover {
  background: var(--danger-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
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
  transition: var(--transition);
  border: none;
  font-size: 1rem;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 12px var(--shadow-colored);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px var(--shadow-colored);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  box-shadow: 0 4px 12px var(--shadow);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Form Elements */
input, textarea, select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transition: var(--transition);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-bg);
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
  box-shadow: 0 4px 20px var(--shadow);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.card:hover {
  box-shadow: 0 12px 32px var(--shadow);
  border-color: var(--border-light);
  transform: translateY(-2px);
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
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-hover);
  border-radius: 6px;
  border: 2px solid var(--bg-secondary);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* Selection */
::selection {
  background: var(--accent-primary);
  color: white;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease;
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