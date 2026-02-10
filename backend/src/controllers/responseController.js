const Response = require('../models/Response');
const Survey = require('../models/Survey');
const { calculateAnalytics } = require('../utils/analytics');

// Submit response (public - no auth required)
exports.submitResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Find survey by public link
    const survey = await Survey.findOne({ publicLink: req.params.publicLink });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isOpen) {
      return res.status(403).json({ message: 'This survey is closed' });
    }

    // Create response
    const response = new Response({
      surveyId: survey._id,
      answers
    });

    await response.save();

    res.status(201).json({
      message: 'Response submitted successfully',
      response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all responses for a survey (protected)
exports.getSurveyResponses = async (req, res) => {
  try {
    // Verify ownership
    const survey = await Survey.findOne({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const responses = await Response.find({ surveyId: survey._id })
      .sort({ submittedAt: -1 });

    res.json({ responses, total: responses.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get analytics for a survey (protected)
exports.getSurveyAnalytics = async (req, res) => {
  try {
    // Verify ownership
    const survey = await Survey.findOne({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const responses = await Response.find({ surveyId: survey._id });
    
    if (responses.length === 0) {
      return res.json({
        totalResponses: 0,
        analytics: []
      });
    }

    const analytics = calculateAnalytics(survey, responses);

    res.json({
      totalResponses: responses.length,
      analytics
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};