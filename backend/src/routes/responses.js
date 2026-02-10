const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const auth = require('../middleware/auth');

// Public route - submit response
router.post('/public/:publicLink', responseController.submitResponse);

// Protected routes - view responses and analytics
router.get('/survey/:id', auth, responseController.getSurveyResponses);
router.get('/survey/:id/analytics', auth, responseController.getSurveyAnalytics);

module.exports = router;