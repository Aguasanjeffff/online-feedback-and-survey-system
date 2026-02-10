<template>
  <div class="response-list">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading responses...</p>
    </div>

    <div v-else-if="responses.length === 0" class="empty-state card">
      <div class="empty-icon">📭</div>
      <h3>No responses yet</h3>
      <p>Responses will appear here once people start submitting the survey.</p>
    </div>

    <div v-else>
      <div class="responses-header card">
        <h3>📊 All Responses ({{ responses.length }})</h3>
        <p class="responses-subtitle">View detailed responses from all respondents</p>
      </div>

      <div v-for="(response, index) in responses" :key="response._id" class="response-card card">
        <!-- Response Header with Respondent Info -->
        <div class="response-header">
          <div class="response-meta">
            <h4>
              <span class="response-badge">Response #{{ responses.length - index }}</span>
              <span class="respondent-name">{{ response.respondentInfo.name }}</span>
            </h4>
            <div class="respondent-details">
              <span class="detail-item">
                <span class="detail-icon">📧</span>
                {{ response.respondentInfo.email }}
              </span>
              <span class="detail-item">
                <span class="detail-icon">🏫</span>
                {{ response.respondentInfo.school }}
              </span>
              <span v-if="response.respondentInfo.age" class="detail-item">
                <span class="detail-icon">🎂</span>
                {{ response.respondentInfo.age }} years old
              </span>
              <span v-if="response.respondentInfo.gender" class="detail-item">
                <span class="detail-icon">👤</span>
                {{ response.respondentInfo.gender }}
              </span>
            </div>
          </div>
          <span class="response-date">
            <span class="date-icon">🕒</span>
            {{ formatDate(response.submittedAt) }}
          </span>
        </div>

        <div class="response-divider"></div>

        <!-- Survey Answers -->
        <div class="response-answers">
          <h5 class="answers-title">Survey Answers:</h5>
          <div v-for="(answer, answerIndex) in response.answers" :key="answer.questionId" class="answer-item">
            <div class="answer-header">
              <span class="answer-number">Q{{ answerIndex + 1 }}</span>
              <p class="answer-question">{{ getQuestionText(answer.questionId) }}</p>
            </div>
            <div class="answer-value">
              <span v-if="Array.isArray(answer.answer)">{{ answer.answer.join(', ') }}</span>
              <span v-else>{{ answer.answer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { responseAPI, surveyAPI } from '../../services/api';

export default {
  name: 'ResponseList',
  props: {
    surveyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      responses: [],
      survey: null,
      loading: true
    };
  },
  mounted() {
    this.fetchResponses();
  },
  methods: {
    async fetchResponses() {
      try {
        const [responsesRes, surveyRes] = await Promise.all([
          responseAPI.getSurveyResponses(this.surveyId),
          surveyAPI.getSurveyById(this.surveyId)
        ]);
        
        this.responses = responsesRes.data.responses;
        this.survey = surveyRes.data.survey;
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        this.loading = false;
      }
    },
    getQuestionText(questionId) {
      const question = this.survey?.questions.find(q => q.questionId === questionId);
      return question?.questionText || 'Unknown question';
    },
    formatDate(date) {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-hover);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-muted);
}

.responses-header {
  margin-bottom: 2rem;
  text-align: center;
  background: var(--bg-secondary);
  border-left: 4px solid var(--accent-primary);
}

.responses-header h3 {
  color: var(--text-primary);
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.responses-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.response-card {
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--accent-primary);
  transition: all 0.3s ease;
}

.response-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px var(--shadow);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.response-meta h4 {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.response-badge {
  background: var(--accent-primary);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
}

.respondent-name {
  color: var(--text-primary);
  font-size: 1.25rem;
}

.respondent-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  background: var(--bg-tertiary);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
}

.detail-icon {
  font-size: 1.1rem;
}

.response-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  white-space: nowrap;
  background: var(--bg-tertiary);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
}

.date-icon {
  font-size: 1rem;
}

.response-divider {
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), transparent);
  margin-bottom: 1.5rem;
}

.answers-title {
  color: var(--text-secondary);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.response-answers {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.answer-item {
  background: var(--bg-tertiary);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent-primary);
}

.answer-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.answer-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.answer-question {
  color: var(--text-secondary);
  font-weight: 500;
  flex: 1;
}

.answer-value {
  color: var(--text-primary);
  font-size: 1.05rem;
  padding-left: 2.25rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .response-header {
    flex-direction: column;
  }
  
  .respondent-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .response-date {
    align-self: flex-start;
  }
}
</style>