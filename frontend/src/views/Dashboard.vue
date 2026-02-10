<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>My Surveys</h1>
      <router-link to="/survey/create" class="btn btn-primary">
        ➕ Create New Survey
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading surveys...</div>

    <div v-else-if="surveys.length === 0" class="empty-state">
      <p>📝 You haven't created any surveys yet</p>
      <router-link to="/survey/create" class="btn btn-primary">
        Create Your First Survey
      </router-link>
    </div>

    <div v-else class="survey-grid">
      <div v-for="survey in surveys" :key="survey._id" class="survey-card card">
        <div class="survey-status" :class="{ open: survey.isOpen, closed: !survey.isOpen }">
          {{ survey.isOpen ? '🟢 Open' : '🔴 Closed' }}
        </div>

        <h3>{{ survey.title }}</h3>
        <p class="survey-description">{{ survey.description || 'No description' }}</p>

        <div class="survey-stats">
          <span>📊 {{ survey.responseCount }} responses</span>
          <span>❓ {{ survey.questions.length }} questions</span>
        </div>

        <div class="survey-actions">
          <router-link :to="`/survey/${survey._id}`" class="btn btn-primary">
            View Details
          </router-link>
          <button @click="toggleStatus(survey)" class="btn btn-secondary">
            {{ survey.isOpen ? 'Close' : 'Open' }}
          </button>
          <button @click="deleteSurvey(survey._id)" class="btn-delete">
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { surveyAPI } from '../services/api';

export default {
  name: 'Dashboard',
  data() {
    return {
      surveys: [],
      loading: true
    };
  },
  mounted() {
    this.fetchSurveys();
  },
  methods: {
    async fetchSurveys() {
      try {
        const response = await surveyAPI.getMySurveys();
        this.surveys = response.data.surveys;
      } catch (error) {
        console.error('Error fetching surveys:', error);
      } finally {
        this.loading = false;
      }
    },
    async toggleStatus(survey) {
      try {
        await surveyAPI.toggleStatus(survey._id);
        survey.isOpen = !survey.isOpen;
      } catch (error) {
        console.error('Error toggling survey status:', error);
      }
    },
    async deleteSurvey(id) {
      if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
        return;
      }

      try {
        await surveyAPI.delete(id);
        this.surveys = this.surveys.filter(s => s._id !== id);
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  }
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #1f2937;
}

.loading, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
}

.empty-state p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.survey-card {
  position: relative;
}

.survey-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.survey-status.open {
  background: #d1fae5;
  color: #065f46;
}

.survey-status.closed {
  background: #fee2e2;
  color: #991b1b;
}

.survey-card h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.survey-description {
  color: #64748b;
  margin-bottom: 1rem;
  min-height: 3rem;
}

.survey-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.survey-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: #fecaca;
}
</style>