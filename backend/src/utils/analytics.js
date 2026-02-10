// Calculate analytics for survey responses
exports.calculateAnalytics = (survey, responses) => {
  const analytics = [];

  survey.questions.forEach(question => {
    const questionAnalytics = {
      questionId: question.questionId,
      questionText: question.questionText,
      type: question.type
    };

    // Get all answers for this question
    const answers = responses
      .map(r => r.answers.find(a => a.questionId === question.questionId))
      .filter(a => a && a.answer);

    if (question.type === 'multiple-choice') {
      // Count occurrences of each option
      const optionCounts = {};
      question.options.forEach(opt => optionCounts[opt] = 0);

      answers.forEach(a => {
        if (optionCounts.hasOwnProperty(a.answer)) {
          optionCounts[a.answer]++;
        }
      });

      // Find most selected option
      const mostSelected = Object.keys(optionCounts).reduce((a, b) => 
        optionCounts[a] > optionCounts[b] ? a : b
      );

      questionAnalytics.optionCounts = optionCounts;
      questionAnalytics.mostSelected = mostSelected;
      questionAnalytics.mostSelectedCount = optionCounts[mostSelected];
      questionAnalytics.totalAnswers = answers.length;

    } else if (question.type === 'rating') {
      // Calculate average rating
      const ratings = answers.map(a => Number(a.answer)).filter(r => !isNaN(r));
      const average = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

      // Count each rating (1-5)
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(r => {
        if (ratingCounts.hasOwnProperty(r)) {
          ratingCounts[r]++;
        }
      });

      questionAnalytics.averageRating = Math.round(average * 10) / 10;
      questionAnalytics.ratingCounts = ratingCounts;
      questionAnalytics.totalAnswers = ratings.length;

    } else if (question.type === 'short-answer') {
      // Just provide all answers for short answer
      questionAnalytics.answers = answers.map(a => a.answer);
      questionAnalytics.totalAnswers = answers.length;
    }

    analytics.push(questionAnalytics);
  });

  return analytics;
};