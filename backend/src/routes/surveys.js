const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, surveyController.createSurvey);
router.get('/', auth, surveyController.getMySurveys);
router.get('/:id', auth, surveyController.getSurveyById);
router.put('/:id', auth, surveyController.updateSurvey);
router.patch('/:id/status', auth, surveyController.toggleSurveyStatus);
router.delete('/:id', auth, surveyController.deleteSurvey);

// Public route
router.get('/public/:publicLink', surveyController.getPublicSurvey);

module.exports = router;