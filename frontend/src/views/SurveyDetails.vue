<template>
  <div class="survey-details">
    <div v-if="loading" class="loading">Loading survey details...</div>

    <div v-else-if="survey">
      <div class="page-header">
        <div>
          <h1>{{ survey.title }}</h1>
          <p class="survey-description">{{ survey.description }}</p>
        </div>
        <div class="header-actions">
          <span class="status-badge" :class="{ open: survey.isOpen, closed: !survey.isOpen }">
            {{ survey.isOpen ? '🟢 Open' : '🔴 Closed' }}
          </span>
          <router-link to="/dashboard" class="btn btn-secondary">
            ← Back
          </router-link>
        </div>
      </div>

      <!-- Public Link Section -->
      <div class="card public-link-section">
        <h3>📤 Share Survey</h3>
        <div class="link-container">
          <input 
            :value="publicUrl" 
            readonly 
            ref="linkInput"
            class="link-input"
          />
          <button @click="copyLink" class="btn btn-primary">
            {{ copied ? '✅ Copied!' : '📋 Copy Link' }}
          </button>
        </div>
        <p class="link-hint">Share this link with anyone to collect responses</p>
      </div>

      <!-- Stats Section -->
      <div class="stats-grid">
        <div class="stat-card card">
          <h4>Total Responses</h4>
          <p class="stat-number">{{ survey.responseCount }}</p>
        </div>
        <div class="stat-card card">
          <h4>Total Questions</h4>
          <p class="stat-number">{{ survey.questions.length }}</p>
        </div>
        <div class="stat-card card">
          <h4>Status</h4>
          <p class="stat-number">{{ survey.isOpen ? 'Active' : 'Closed' }}</p>
        </div>
        <div class="stat-card card">
          <button @click="toggleStatus" class="btn btn-primary btn-block">
            {{ survey.isOpen ? 'Close Survey' : 'Open Survey' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'questions' }"
          @click="activeTab = 'questions'"
          class="tab-button"
        >
          📝 Questions
        </button>
        <button 
          :class="{ active: activeTab === 'responses' }"
          @click="activeTab = 'responses'"
          class="tab-button"
        >
          📊 Responses ({{ survey.responseCount }})
        </button>
        <button 
          :class="{ active: activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
          class="tab-button"
        >
          📈 Analytics
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Questions Tab -->
        <div v-if="activeTab === 'questions'" class="questions-list">
          <div v-for="(question, index) in survey.questions" :key="question.questionId" class="card">
            <h4>Question {{ index + 1 }}</h4>
            <p><strong>{{ question.questionText }}</strong></p>
            <p class="question-type">Type: {{ formatQuestionType(question.type) }}</p>
            <div v-if="question.type === 'multiple-choice'" class="options-list">
              <p><strong>Options:</strong></p>
              <ul>
                <li v-for="(option, idx) in question.options" :key="idx">{{ option }}</li>
              </ul>
            </div>
            <span v-if="question.required" class="required-badge">Required</span>
          </div>
        </div>

        <!-- Responses Tab -->
        <div v-if="activeTab === 'responses'">
          <ResponseList :surveyId="survey._id" />
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <AnalyticsView :surveyId="survey._id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { surveyAPI } from '../services/api';
import ResponseList from '../components/response/ResponseList.vue';
import AnalyticsView from '../components/analytics/AnalyticsView.vue';

export default {
  name: 'SurveyDetails',
  components: {
    ResponseList,
    AnalyticsView
  },
  data() {
    return {
      survey: null,
      loading: true,
      activeTab: 'questions',
      copied: false
    };
  },
  computed: {
    publicUrl() {
      return `${window.location.origin}/s/${this.survey?.publicLink}`;
    }
  },
  mounted() {
    this.fetchSurvey();
  },
  methods: {
    async fetchSurvey() {
      try {
        const response = await surveyAPI.getSurveyById(this.$route.params.id);
        this.survey = response.data.survey;
      } catch (error) {
        console.error('Error fetching survey:', error);
        this.$router.push('/dashboard');
      } finally {
        this.loading = false;
      }
    },
    async toggleStatus() {
      try {
        await surveyAPI.toggleStatus(this.survey._id);
        this.survey.isOpen = !this.survey.isOpen;
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    },
    copyLink() {
      this.$refs.linkInput.select();
      document.execCommand('copy');
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
    formatQuestionType(type) {
      const types = {
        'multiple-choice': 'Multiple Choice',
        'short-answer': 'Short Answer',
        'rating': 'Rating (1-5)'
      };
      return types[type] || type;
    }
  }
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.survey-description {
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.open {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.closed {
  background: #fee2e2;
  color: #991b1b;
}

.public-link-section h3 {
  margin-bottom: 1rem;
}

.link-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.link-input {
  flex: 1;
  background: #f8fafc;
  font-family: monospace;
}

.link-hint {
  color: #64748b;
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
}

.stat-card h4 {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4f46e5;
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tab-button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tab-content {
  min-height: 400px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.questions-list h4 {
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

.question-type {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.options-list {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.options-list ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.required-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #64748b;
}
</style>