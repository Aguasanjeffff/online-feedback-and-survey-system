<template>
  <div class="public-response">
    <div v-if="loading" class="loading">Loading survey...</div>

    <div v-else-if="error" class="error-state card">
      <h2>❌ {{ error }}</h2>
      <p>This survey may be closed or no longer available.</p>
    </div>

    <div v-else-if="submitted" class="success-state card">
      <h2>✅ Thank You!</h2>
      <p>Your response has been submitted successfully.</p>
    </div>

    <div v-else-if="survey" class="survey-container">
      <div class="survey-header card">
        <h1>{{ survey.title }}</h1>
        <p v-if="survey.description" class="survey-description">{{ survey.description }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-for="(question, index) in survey.questions" :key="question.questionId" class="question-card card">
          <label class="question-label">
            {{ index + 1 }}. {{ question.questionText }}
            <span v-if="question.required" class="required-mark">*</span>
          </label>

          <!-- Multiple Choice -->
          <div v-if="question.type === 'multiple-choice'" class="question-content">
            <div v-for="option in question.options" :key="option" class="radio-option">
              <label>
                <input 
                  type="radio" 
                  :name="question.questionId"
                  :value="option"
                  v-model="answers[question.questionId]"
                  :required="question.required"
                />
                {{ option }}
              </label>
            </div>
          </div>

          <!-- Short Answer -->
          <div v-else-if="question.type === 'short-answer'" class="question-content">
            <textarea 
              v-model="answers[question.questionId]"
              :required="question.required"
              rows="4"
              placeholder="Your answer..."
            ></textarea>
          </div>

          <!-- Rating -->
          <div v-else-if="question.type === 'rating'" class="question-content">
            <div class="rating-options">
              <label v-for="rating in [1, 2, 3, 4, 5]" :key="rating" class="rating-option">
                <input 
                  type="radio"
                  :name="question.questionId"
                  :value="rating"
                  v-model.number="answers[question.questionId]"
                  :required="question.required"
                />
                <span class="rating-label">{{ rating }}</span>
              </label>
            </div>
            <div class="rating-labels">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        <div class="submit-section">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Submitting...' : '✅ Submit Response' }}
          </button>
          <p v-if="submitError" class="error-message">{{ submitError }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { surveyAPI, responseAPI } from '../services/api';

export default {
  name: 'PublicResponse',
  data() {
    return {
      survey: null,
      answers: {},
      loading: true,
      submitting: false,
      submitted: false,
      error: '',
      submitError: ''
    };
  },
  mounted() {
    this.fetchSurvey();
  },
  methods: {
    async fetchSurvey() {
      try {
        const response = await surveyAPI.getPublicSurvey(this.$route.params.publicLink);
        this.survey = response.data.survey;
        
        // Initialize answers object
        this.survey.questions.forEach(q => {
          this.answers[q.questionId] = q.type === 'rating' ? null : '';
        });
      } catch (error) {
        this.error = error.response?.data?.message || 'Survey not found';
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      this.submitting = true;
      this.submitError = '';

      try {
        // Format answers
        const formattedAnswers = Object.entries(this.answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }));

        await responseAPI.submit(this.$route.params.publicLink, {
          answers: formattedAnswers
        });

        this.submitted = true;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        this.submitError = error.response?.data?.message || 'Failed to submit response';
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.public-response {
  max-width: 800px;
  margin: 0 auto;
}

.survey-header {
  text-align: center;
  margin-bottom: 2rem;
}

.survey-header h1 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.survey-description {
  color: #64748b;
  font-size: 1.1rem;
}

.question-card {
  margin-bottom: 2rem;
}

.question-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 1rem;
}

.required-mark {
  color: #ef4444;
  margin-left: 0.25rem;
}

.question-content {
  margin-top: 1rem;
}

.radio-option {
  margin-bottom: 0.75rem;
}

.radio-option label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.radio-option label:hover {
  background: #e2e8f0;
}

.radio-option input[type="radio"] {
  width: auto;
  cursor: pointer;
}

.rating-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.rating-option {
  cursor: pointer;
}

.rating-option input[type="radio"] {
  display: none;
}

.rating-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #f1f5f9;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  font-weight: bold;
  transition: all 0.3s;
}

.rating-option input[type="radio"]:checked + .rating-label {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: scale(1.1);
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.875rem;
}

.submit-section {
  text-align: center;
  margin-top: 2rem;
}

.submit-section button {
  min-width: 200px;
}

.success-state, .error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.success-state h2 {
  color: #059669;
  margin-bottom: 1rem;
}

.error-state h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-message {
  color: #ef4444;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #64748b;
}
</style>