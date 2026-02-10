const Survey = require('../models/Survey');
const Response = require('../models/Response');

// Create new survey
exports.createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const survey = new Survey({
      creatorId: req.user._id,
      title,
      description,
      questions
    });

    await survey.save();

    res.status(201).json({
      message: 'Survey created successfully',
      survey
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all surveys by creator
exports.getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ creatorId: req.user._id })
      .sort({ createdAt: -1 });

    // Get response counts for each survey
    const surveysWithCounts = await Promise.all(
      surveys.map(async (survey) => {
        const responseCount = await Response.countDocuments({ surveyId: survey._id });
        return {
          ...survey.toObject(),
          responseCount
        };
      })
    );

    res.json({ surveys: surveysWithCounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single survey details
exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const responseCount = await Response.countDocuments({ surveyId: survey._id });

    res.json({
      survey: {
        ...survey.toObject(),
        responseCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update survey
exports.updateSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, creatorId: req.user._id },
      { title, description, questions, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json({ message: 'Survey updated successfully', survey });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle survey status (open/close)
exports.toggleSurveyStatus = async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    survey.isOpen = !survey.isOpen;
    await survey.save();

    res.json({
      message: `Survey ${survey.isOpen ? 'opened' : 'closed'} successfully`,
      survey
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete survey
exports.deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findOneAndDelete({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Delete all responses for this survey
    await Response.deleteMany({ surveyId: survey._id });

    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get public survey (no auth required)
exports.getPublicSurvey = async (req, res) => {
  try {
    const survey = await Survey.findOne({ publicLink: req.params.publicLink });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isOpen) {
      return res.status(403).json({ message: 'This survey is closed' });
    }

    // Don't send creatorId to public
    const publicSurvey = {
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      questions: survey.questions
    };

    res.json({ survey: publicSurvey });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};