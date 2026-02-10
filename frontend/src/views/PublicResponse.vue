<template>
  <div class="public-response">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading survey...</p>
    </div>

    <div v-else-if="error" class="error-state card">
      <div class="error-icon">❌</div>
      <h2>{{ error }}</h2>
      <p>This survey may be closed or no longer available.</p>
    </div>

    <div v-else-if="submitted" class="success-state card">
      <div class="success-animation">
        <div class="checkmark">✓</div>
      </div>
      <h2>Thank You!</h2>
      <p class="success-message">Your response has been submitted successfully.</p>
      <p class="success-submessage">We appreciate your time and feedback.</p>
    </div>

    <div v-else-if="survey" class="survey-container">
      <!-- Survey Header -->
      <div class="survey-header card">
        <div class="survey-badge">📋 Survey</div>
        <h1>{{ survey.title }}</h1>
        <p v-if="survey.description" class="survey-description">{{ survey.description }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Respondent Information Section -->
        <div class="respondent-section card">
          <div class="section-header">
            <h3>📝 Your Information</h3>
            <p>Please fill in your details before answering the survey</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Full Name <span class="required">*</span></label>
              <input 
                v-model="respondentInfo.name"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="form-group">
              <label>Email Address <span class="required">*</span></label>
              <input 
                v-model="respondentInfo.email"
                type="email"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div class="form-group">
              <label>School/Institution <span class="required">*</span></label>
              <input 
                v-model="respondentInfo.school"
                type="text"
                placeholder="Enter your school name"
                required
              />
            </div>

            <div class="form-group">
              <label>Age (Optional)</label>
              <input 
                v-model.number="respondentInfo.age"
                type="number"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div class="form-group full-width">
              <label>Gender (Optional)</label>
              <select v-model="respondentInfo.gender">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Survey Questions Section -->
        <div class="questions-section">
          <div class="section-divider">
            <span>Survey Questions</span>
          </div>

          <div v-for="(question, index) in survey.questions" :key="question.questionId" class="question-card card">
            <label class="question-label">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-text">{{ question.questionText }}</span>
              <span v-if="question.required" class="required-badge">Required</span>
            </label>

            <!-- Multiple Choice -->
            <div v-if="question.type === 'multiple-choice'" class="question-content">
              <div v-for="option in question.options" :key="option" class="radio-option">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    :name="question.questionId"
                    :value="option"
                    v-model="answers[question.questionId]"
                    :required="question.required"
                  />
                  <span class="radio-custom"></span>
                  <span class="radio-text">{{ option }}</span>
                </label>
              </div>
            </div>

            <!-- Short Answer -->
            <div v-else-if="question.type === 'short-answer'" class="question-content">
              <textarea 
                v-model="answers[question.questionId]"
                :required="question.required"
                rows="4"
                placeholder="Type your answer here..."
                class="answer-textarea"
              ></textarea>
            </div>

            <!-- Rating -->
            <div v-else-if="question.type === 'rating'" class="question-content">
              <div class="rating-container">
                <div class="rating-options">
                  <label v-for="rating in [1, 2, 3, 4, 5]" :key="rating" class="rating-option">
                    <input 
                      type="radio"
                      :name="question.questionId"
                      :value="rating"
                      v-model.number="answers[question.questionId]"
                      :required="question.required"
                    />
                    <span class="rating-circle">{{ rating }}</span>
                  </label>
                </div>
                <div class="rating-labels">
                  <span>😞 Poor</span>
                  <span>😊 Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="submit-section card">
          <button type="submit" class="btn btn-primary btn-submit" :disabled="submitting">
            <span v-if="!submitting">✅ Submit Response</span>
            <span v-else>
              <span class="spinner-small"></span>
              Submitting...
            </span>
          </button>
          <p v-if="submitError" class="error-message">
            <span class="error-icon-small">⚠️</span>
            {{ submitError }}
          </p>
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
      respondentInfo: {
        name: '',
        email: '',
        school: '',
        age: null,
        gender: ''
      },
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
          respondentInfo: this.respondentInfo,
          answers: formattedAnswers
        });

        this.submitted = true;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        this.submitError = error.response?.data?.message || 'Failed to submit response. Please try again.';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.public-response {
  max-width: 900px;
  margin: 0 auto;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-hover);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Success State */
.success-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-animation {
  margin-bottom: 2rem;
}

.checkmark {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-state h2 {
  color: var(--success-light);
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.success-message {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.success-submessage {
  color: var(--text-secondary);
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h2 {
  color: var(--danger-light);
  margin-bottom: 1rem;
}

.error-state p {
  color: var(--text-secondary);
}

/* Survey Header */
.survey-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.survey-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-light));
}

.survey-badge {
  display: inline-block;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-light);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.survey-header h1 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 2.5rem;
  line-height: 1.2;
}

.survey-description {
  color: var(--text-secondary);
  font-size: 1.15rem;
  line-height: 1.6;
}

/* Respondent Section */
.respondent-section {
  margin-bottom: 2rem;
  border-left: 4px solid var(--accent-primary);
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.full-width {
  grid-column: 1 / -1;
}

.required {
  color: var(--danger);
  margin-left: 0.25rem;
}

/* Section Divider */
.section-divider {
  text-align: center;
  margin: 3rem 0 2rem;
  position: relative;
}

.section-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
}

.section-divider span {
  position: relative;
  background: var(--bg-primary);
  padding: 0.5rem 1.5rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 1px;
}

/* Question Card */
.question-card {
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateY(-2px);
}

.question-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.95rem;
}

.question-text {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

.required-badge {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-light);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* Radio Options */
.radio-option {
  margin-bottom: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.radio-label:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
}

.radio-label input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.radio-label input[type="radio"]:checked ~ .radio-custom {
  border-color: var(--accent-primary);
  background: var(--accent-primary);
}

.radio-label input[type="radio"]:checked ~ .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.radio-label input[type="radio"]:checked ~ .radio-text {
  color: var(--accent-light);
  font-weight: 500;
}

.radio-text {
  flex: 1;
  color: var(--text-primary);
}

/* Textarea */
.answer-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

/* Rating */
.rating-container {
  background: var(--bg-tertiary);
  padding: 2rem;
  border-radius: var(--radius-md);
}

.rating-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.rating-option {
  cursor: pointer;
  position: relative;
}

.rating-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.rating-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  border: 3px solid var(--border);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.rating-option:hover .rating-circle {
  border-color: var(--accent-primary);
  transform: scale(1.1);
}

.rating-option input[type="radio"]:checked + .rating-circle {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Submit Section */
.submit-section {
  text-align: center;
  margin-top: 3rem;
  padding: 2.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
}

.btn-submit {
  min-width: 250px;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--danger-light);
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  font-weight: 500;
}

.error-icon-small {
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .survey-header h1 {
    font-size: 2rem;
  }
  
  .rating-options {
    gap: 0.5rem;
  }
  
  .rating-circle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .question-label {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>