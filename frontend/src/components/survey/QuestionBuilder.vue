<template>
  <div class="question-builder">
    <div v-for="(question, index) in questions" :key="question.questionId" class="question-item card">
      <div class="question-header">
        <h4>Question {{ index + 1 }}</h4>
        <button @click="removeQuestion(index)" class="btn-delete" type="button">
          🗑️ Remove
        </button>
      </div>

      <div class="form-group">
        <label>Question Type</label>
        <select v-model="question.type" @change="onTypeChange(question)">
          <option value="multiple-choice">Multiple Choice</option>
          <option value="short-answer">Short Answer</option>
          <option value="rating">Rating (1-5)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Question Text</label>
        <input 
          v-model="question.questionText" 
          type="text" 
          placeholder="Enter your question"
          required
        />
      </div>

      <!-- Multiple Choice Options -->
      <div v-if="question.type === 'multiple-choice'" class="options-section">
        <label>Options</label>
        <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-input">
          <input 
            v-model="question.options[optIndex]" 
            type="text" 
            :placeholder="`Option ${optIndex + 1}`"
            required
          />
          <button 
            v-if="question.options.length > 2"
            @click="removeOption(question, optIndex)" 
            class="btn-remove-option"
            type="button"
          >
            ❌
          </button>
        </div>
        <button @click="addOption(question)" class="btn-add-option" type="button">
          ➕ Add Option
        </button>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="question.required" />
          Required question
        </label>
      </div>
    </div>

    <button @click="addQuestion" class="btn btn-secondary" type="button">
      ➕ Add Question
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuestionBuilder',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    questions: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    addQuestion() {
      this.questions.push({
        questionId: Date.now().toString(),
        type: 'multiple-choice',
        questionText: '',
        options: ['', ''],
        required: false
      });
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    addOption(question) {
      question.options.push('');
    },
    removeOption(question, index) {
      question.options.splice(index, 1);
    },
    onTypeChange(question) {
      if (question.type === 'multiple-choice' && !question.options) {
        question.options = ['', ''];
      } else if (question.type !== 'multiple-choice') {
        delete question.options;
      }
    }
  }
};
</script>

<style scoped>
.question-builder {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-item {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.question-header h4 {
  color: #4f46e5;
  font-size: 1.1rem;
}

.options-section {
  margin-bottom: 1rem;
}

.options-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.option-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.option-input input {
  flex: 1;
}

.btn-remove-option {
  background: #fee2e2;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-add-option {
  background: #dbeafe;
  color: #1e40af;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  margin-top: 0.5rem;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}
</style>