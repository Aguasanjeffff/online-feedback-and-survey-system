<template>
  <div class="response-list">
    <div v-if="loading" class="loading">Loading responses...</div>

    <div v-else-if="responses.length === 0" class="empty-state">
      <p>📭 No responses yet</p>
    </div>

    <div v-else>
      <div class="responses-header">
        <h3>All Responses ({{ responses.length }})</h3>
      </div>

      <div v-for="(response, index) in responses" :key="response._id" class="response-card card">
        <div class="response-header">
          <h4>Response #{{ responses.length - index }}</h4>
          <span class="response-date">{{ formatDate(response.submittedAt) }}</span>
        </div>

        <div class="response-answers">
          <div v-for="answer in response.answers" :key="answer.questionId" class="answer-item">
            <p class="answer-question"><strong>Q:</strong> {{ getQuestionText(answer.questionId) }}</p>
            <p class="answer-value">
              <strong>A:</strong> 
              <span v-if="Array.isArray(answer.answer)">{{ answer.answer.join(', ') }}</span>
              <span v-else>{{ answer.answer }}</span>
            </p>
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
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
.responses-header {
  margin-bottom: 1.5rem;
}

.responses-header h3 {
  color: #1f2937;
}

.response-card {
  margin-bottom: 1.5rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.response-header h4 {
  color: #4f46e5;
}

.response-date {
  color: #64748b;
  font-size: 0.875rem;
}

.response-answers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.answer-item {
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.answer-question {
  color: #475569;
  margin-bottom: 0.5rem;
}

.answer-value {
  color: #1f2937;
  font-size: 1.05rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-state p {
  font-size: 1.25rem;
}
</style>