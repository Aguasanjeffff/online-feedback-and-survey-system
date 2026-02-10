<template>
  <div class="create-survey">
    <div class="page-header">
      <h1>Create New Survey</h1>
      <router-link to="/dashboard" class="btn btn-secondary">
        ← Back to Dashboard
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="survey-form">
      <div class="card">
        <h2>Survey Information</h2>
        
        <div class="form-group">
          <label>Survey Title *</label>
          <input 
            v-model="formData.title" 
            type="text" 
            placeholder="e.g., Customer Satisfaction Survey"
            required
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            v-model="formData.description" 
            rows="3"
            placeholder="Briefly describe your survey"
          ></textarea>
        </div>
      </div>

      <div class="card">
        <h2>Questions</h2>
        <QuestionBuilder v-model="formData.questions" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading || !isValid">
          {{ loading ? 'Creating...' : '✅ Create Survey' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="!isValid" class="warning-message">
          ⚠️ Please add at least one question before creating the survey
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import QuestionBuilder from '../components/survey/QuestionBuilder.vue';
import { surveyAPI } from '../services/api';

export default {
  name: 'CreateSurvey',
  components: {
    QuestionBuilder
  },
  data() {
    return {
      formData: {
        title: '',
        description: '',
        questions: []
      },
      loading: false,
      error: ''
    };
  },
  computed: {
    isValid() {
      return this.formData.title && this.formData.questions.length > 0;
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isValid) return;

      this.loading = true;
      this.error = '';

      try {
        const response = await surveyAPI.create(this.formData);
        
        // Redirect to survey details
        this.$router.push(`/survey/${response.data.survey._id}`);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create survey';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.survey-form h2 {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message {
  color: #ef4444;
  font-weight: 500;
}

.warning-message {
  color: #f59e0b;
  font-size: 0.875rem;
}
</style>