<template>
  <div class="analytics-view">
    <div v-if="loading" class="loading">Calculating analytics...</div>

    <div v-else-if="analytics.length === 0" class="empty-state">
      <p>📊 No responses to analyze yet</p>
    </div>

    <div v-else>
      <div class="analytics-header">
        <h3>Survey Analytics</h3>
        <p>Total Responses: <strong>{{ totalResponses }}</strong></p>
      </div>

      <div v-for="analytic in analytics" :key="analytic.questionId" class="analytic-card card">
        <h4>{{ analytic.questionText }}</h4>
        <p class="question-type">{{ formatQuestionType(analytic.type) }}</p>

        <!-- Multiple Choice Analytics -->
        <div v-if="analytic.type === 'multiple-choice'" class="chart-container">
          <div class="stat-highlight">
            <p>Most Selected: <strong>{{ analytic.mostSelected }}</strong></p>
            <p>Count: <strong>{{ analytic.mostSelectedCount }}</strong> / {{ analytic.totalAnswers }}</p>
          </div>
          
          <div class="bar-chart">
            <div v-for="(count, option) in analytic.optionCounts" :key="option" class="bar-item">
              <div class="bar-label">{{ option }}</div>
              <div class="bar-container">
                <div 
                  class="bar-fill" 
                  :style="{ width: (count / analytic.totalAnswers * 100) + '%' }"
                ></div>
                <span class="bar-count">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating Analytics -->
        <div v-else-if="analytic.type === 'rating'" class="chart-container">
          <div class="stat-highlight">
            <p>Average Rating: <strong>{{ analytic.averageRating }}</strong> / 5</p>
            <p>Total Ratings: <strong>{{ analytic.totalAnswers }}</strong></p>
          </div>

          <div class="rating-chart">
            <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-bar">
              <span class="rating-label">{{ rating }} ⭐</span>
              <div class="bar-container">
                <div 
                  class="bar-fill rating-fill" 
                  :style="{ width: (analytic.ratingCounts[rating] / analytic.totalAnswers * 100) + '%' }"
                ></div>
                <span class="bar-count">{{ analytic.ratingCounts[rating] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Short Answer Analytics -->
        <div v-else-if="analytic.type === 'short-answer'" class="answers-list">
          <p><strong>All Responses ({{ analytic.totalAnswers }}):</strong></p>
          <div class="short-answers">
            <div v-for="(answer, index) in analytic.answers" :key="index" class="short-answer-item">
              {{ index + 1 }}. {{ answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { responseAPI } from '../../services/api';

export default {
  name: 'AnalyticsView',
  props: {
    surveyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      analytics: [],
      totalResponses: 0,
      loading: true
    };
  },
  mounted() {
    this.fetchAnalytics();
  },
  methods: {
    async fetchAnalytics() {
      try {
        const response = await responseAPI.getAnalytics(this.surveyId);
        this.analytics = response.data.analytics;
        this.totalResponses = response.data.totalResponses;
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        this.loading = false;
      }
    },
    formatQuestionType(type) {
      const types = {
        'multiple-choice': 'Multiple Choice',
        'short-answer': 'Short Answer',
        'rating': 'Rating'
      };
      return types[type] || type;
    }
  }
};
</script>

<style scoped>
.analytics-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.analytics-header h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.analytics-header p {
  color: #64748b;
}

.analytics-header strong {
  color: #4f46e5;
  font-size: 1.25rem;
}

.analytic-card {
  margin-bottom: 2rem;
}

.analytic-card h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.question-type {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.stat-highlight {
  background: #eff6ff;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-highlight p {
  margin-bottom: 0.25rem;
}

.stat-highlight strong {
  color: #4f46e5;
  font-size: 1.1rem;
}

.bar-chart, .rating-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item, .rating-bar {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: center;
}

.bar-label, .rating-label {
  font-weight: 500;
  color: #475569;
}

.bar-container {
  position: relative;
  background: #e2e8f0;
  border-radius: 0.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
}

.bar-fill {
  background: #4f46e5;
  height: 100%;
  border-radius: 0.5rem;
  transition: width 0.5s ease;
  min-width: 2px;
}

.rating-fill {
  background: #f59e0b;
}

.bar-count {
  position: absolute;
  right: 0.75rem;
  font-weight: bold;
  color: #1f2937;
  z-index: 1;
}

.answers-list {
  margin-top: 1rem;
}

.short-answers {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.short-answer-item {
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid #4f46e5;
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