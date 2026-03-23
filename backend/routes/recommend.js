
const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// Get personalized recommendations (protected)
router.post('/', async (req, res) => {
  try {
    const { skill, interest, goal } = req.body;

    if (!skill || !interest || !goal) {
      return res.status(400).json({ success: false, message: 'skill, interest, goal required' });
    }

    // Query matching courses
    const regularCourses = await Course.find({
      level: skill,
      category: interest,
      goal: goal
    }).limit(12).sort({ rating: -1 });

    // AI-style recommendations (best matches + randomization)
    const allCourses = await Course.find({
      category: interest
    }).limit(50);

    const aiRecommendations = allCourses
      .filter(course => course.link && course.link !== '#') // Defensive check
      .map(course => ({
        ...course._doc,
        score: calculateScore(course, skill, interest, goal)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    res.json({
      success: true,
      regular: regularCourses,
      ai: aiRecommendations,
      stats: {
        regularCount: regularCourses.length,
        aiCount: aiRecommendations.length,
        skill,
        interest,
        goal
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Score calculation (ML-like matching)
function calculateScore(course, userSkill, userInterest, userGoal) {
  let score = 0;
  
  const skillMap = { beginner: 1, intermediate: 2, advanced: 3 };
  
  // Perfect match bonuses
  if (course.level === userSkill) score += 40;
  if (course.category === userInterest) score += 30;
  if (course.goal === userGoal) score += 25;
  
  // Skill proximity
  const skillDiff = Math.abs(skillMap[course.level] - skillMap[userSkill]);
  score += Math.max(15 - skillDiff * 8, 0);
  
  // Rating boost
  score += (course.rating || 0) * 5;
  
  // Randomness for discovery
  score += Math.random() * 10;
  
  return Math.min(Math.round(score), 100);
}

module.exports = router;

