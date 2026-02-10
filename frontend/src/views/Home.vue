<template>
  <div class="home">
    <div class="hero">
      <h1>📊 Online Survey & Feedback System</h1>
      <p>Create surveys, collect responses, and analyze results - all in one place</p>
      <div class="cta-buttons">
        <router-link to="/register" class="btn btn-primary">Get Started</router-link>
        <router-link to="/login" class="btn btn-secondary">Login</router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>✍️ Easy Survey Creation</h3>
        <p>Create surveys with multiple question types in minutes</p>
      </div>
      <div class="feature-card">
        <h3>🔗 Public Links</h3>
        <p>Share surveys with anyone - no account required to respond</p>
      </div>
      <div class="feature-card">
        <h3>📈 Analytics</h3>
        <p>Get instant insights with automatic result summaries</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    // Redirect if already logged in
    if (localStorage.getItem('token')) {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.hero p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.feature-card p {
  color: #64748b;
}
</style>