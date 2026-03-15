
const mongoose = require('mongoose');
const Course = require('./backend/models/Course');
require('dotenv').config();

// Sample courses from old database.js (subset for demo - full data too large)
const sampleCourses = [
  {
    title: "Harvard CS50's Web Programming",
    description: "University-level fundamentals with hands-on projects",
    duration: "12 weeks",
    level: "beginner",
    category: "web",
    goal: "academic",
    rating: 4.9,
    provider: "Harvard",
    link: "https://edx.org/cs50-web",
    difficulty: 1
  },
  {
    title: "The Web Developer Bootcamp 2024",
    description: "Complete full-stack development course with career support",
    duration: "60 hours",
    level: "beginner",
    category: "web",
    goal: "job",
    rating: 4.8,
    provider: "Udemy",
    link: "https://udemy.com/web-bootcamp",
    difficulty: 1
  },
  {
    title: "Google Data Analytics Professional Certificate",
    description: "Prepare for a career in data analytics",
    duration: "6 months",
    level: "beginner",
    category: "data",
    goal: "job",
    rating: 4.8,
    provider: "Google",
    link: "https://coursera.org/google-data-analytics",
    difficulty: 1
  },
  {
    title: "AI For Everyone",
    description: "Non-technical introduction to artificial intelligence",
    duration: "4 weeks",
    level: "beginner",
    category: "ai",
    goal: "academic",
    rating: 4.8,
    provider: "Coursera",
    link: "https://coursera.org/ai-for-everyone",
    difficulty: 1
  },
  // Add 50+ more from database.js or generate
  // Full seed would migrate all ~1000 courses
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    await Course.deleteMany({});
    console.log('🗑️ Cleared old courses');

    await Course.insertMany(sampleCourses);
    console.log(`✅ Seeded ${sampleCourses.length} courses`);

    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDB();