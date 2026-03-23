require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const sampleCourses = [
  // Web Development
  { title: 'Full-Stack Web Development', description: 'Learn MERN stack from scratch.', duration: '12 weeks', level: 'beginner', category: 'web', goal: 'skill', rating: 4.8, provider: 'Udemy', link: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/' },
  { title: 'Advanced React Patterns', description: 'Master complex React applications.', duration: '6 weeks', level: 'advanced', category: 'web', goal: 'job', rating: 4.9, provider: 'Frontend Masters', link: 'https://frontendmasters.com/courses/advanced-react-patterns/' },
  { title: 'JavaScript Algorithms', description: 'Data structures and algorithms in JS.', duration: '8 weeks', level: 'intermediate', category: 'web', goal: 'academic', rating: 4.7, provider: 'Coursera', link: 'https://www.coursera.org/learn/algorithms-and-problem-solving-in-javascript' },
  
  // Data Science
  { title: 'Python for Data Science', description: 'Start your data journey here.', duration: '10 weeks', level: 'beginner', category: 'data', goal: 'skill', rating: 4.6, provider: 'edX', link: 'https://www.edx.org/course/python-for-data-science-2' },
  { title: 'Machine Learning A-Z', description: 'Build predictive models.', duration: '14 weeks', level: 'intermediate', category: 'data', goal: 'certification', rating: 4.8, provider: 'Udemy', link: 'https://www.udemy.com/course/machinelearning/' },
  { title: 'Deep Learning Specialization', description: 'Advanced neural networks.', duration: '16 weeks', level: 'advanced', category: 'data', goal: 'job', rating: 4.9, provider: 'Coursera', link: 'https://www.coursera.org/specializations/deep-learning' },
  
  // AI
  { title: 'AI for Everyone', description: 'Non-technical introduction to AI.', duration: '4 weeks', level: 'beginner', category: 'ai', goal: 'academic', rating: 4.7, provider: 'Coursera', link: 'https://www.coursera.org/learn/ai-for-everyone' },
  { title: 'Building GPT Models', description: 'Learn to train LLMs.', duration: '12 weeks', level: 'advanced', category: 'ai', goal: 'skill', rating: 4.9, provider: 'Fast.ai', link: 'https://fast.ai' },
  
  // Cyber Security
  { title: 'CompTIA Security+', description: 'Get certified in cybersecurity.', duration: '8 weeks', level: 'beginner', category: 'cyber', goal: 'certification', rating: 4.6, provider: 'Cybrary', link: 'https://www.cybrary.it/course/comptia-security-plus/' },
  { title: 'Ethical Hacking Bootcamp', description: 'Learn penetration testing.', duration: '10 weeks', level: 'intermediate', category: 'cyber', goal: 'job', rating: 4.8, provider: 'Udemy', link: 'https://www.udemy.com/course/the-complete-ethical-hacking-bootcamp/' },

  // Cloud Computing
  { title: 'AWS Cloud Practitioner', description: 'Intro to AWS cloud.', duration: '6 weeks', level: 'beginner', category: 'cloud', goal: 'certification', rating: 4.7, provider: 'AWS Training', link: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/' },
  { title: 'Cloud Architecture via Azure', description: 'Design complex cloud systems.', duration: '12 weeks', level: 'advanced', category: 'cloud', goal: 'job', rating: 4.8, provider: 'Microsoft Learn', link: 'https://learn.microsoft.com/en-us/training/paths/azure-solutions-architect-prerequisites/' },

  // Mobile
  { title: 'Flutter App Development', description: 'Build cross-platform apps.', duration: '10 weeks', level: 'beginner', category: 'mobile', goal: 'skill', rating: 4.8, provider: 'Udemy', link: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/' },
  { title: 'Advanced iOS with Swift', description: 'Deep dive into iOS frameworks.', duration: '14 weeks', level: 'advanced', category: 'mobile', goal: 'job', rating: 4.9, provider: 'Pluralsight', link: 'https://www.pluralsight.com/paths/ios-13-and-swift-5-development' }
];

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is missing from .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses to prevent duplicates during testing
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully seeded ${sampleCourses.length} courses!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
