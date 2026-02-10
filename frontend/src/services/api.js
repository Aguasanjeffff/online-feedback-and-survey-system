import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Survey API
export const surveyAPI = {
  create: (data) => api.post('/surveys', data),
  getMySurveys: () => api.get('/surveys'),
  getSurveyById: (id) => api.get(`/surveys/${id}`),
  update: (id, data) => api.put(`/surveys/${id}`, data),
  toggleStatus: (id) => api.patch(`/surveys/${id}/status`),
  delete: (id) => api.delete(`/surveys/${id}`),
  getPublicSurvey: (publicLink) => api.get(`/surveys/public/${publicLink}`)
};

// Response API
export const responseAPI = {
  submit: (publicLink, data) => api.post(`/responses/public/${publicLink}`, data),
  getSurveyResponses: (surveyId) => api.get(`/responses/survey/${surveyId}`),
  getAnalytics: (surveyId) => api.get(`/responses/survey/${surveyId}/analytics`)
};

export default api;