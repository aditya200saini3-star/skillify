
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recommendRoutes = require('./routes/recommend');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  credentials: true
}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // 100 requests per IP
}));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Skillify Backend Ready! 🎯' });
});

// Temporary seed route (Trigger via browser)
app.get('/seed', async (req, res) => {
  try {
    const Course = require('./models/Course');
    const sampleCourses = [
      { title: 'Full-Stack Web Development', description: 'Learn MERN stack from scratch.', duration: '12 weeks', level: 'beginner', category: 'web', goal: 'skill', rating: 4.8, provider: 'Udemy', link: 'https://udemy.com' },
      { title: 'Advanced React Patterns', description: 'Master complex React applications.', duration: '6 weeks', level: 'advanced', category: 'web', goal: 'job', rating: 4.9, provider: 'Frontend Masters', link: 'https://frontendmasters.com' },
      { title: 'JavaScript Algorithms', description: 'Data structures and algorithms in JS.', duration: '8 weeks', level: 'intermediate', category: 'web', goal: 'academic', rating: 4.7, provider: 'Coursera', link: 'https://coursera.org' },
      { title: 'Python for Data Science', description: 'Start your data journey here.', duration: '10 weeks', level: 'beginner', category: 'data', goal: 'skill', rating: 4.6, provider: 'edX', link: 'https://edx.org' },
      { title: 'Machine Learning A-Z', description: 'Build predictive models.', duration: '14 weeks', level: 'intermediate', category: 'data', goal: 'certification', rating: 4.8, provider: 'Udemy', link: 'https://udemy.com' },
      { title: 'Deep Learning Specialization', description: 'Advanced neural networks.', duration: '16 weeks', level: 'advanced', category: 'data', goal: 'job', rating: 4.9, provider: 'Coursera', link: 'https://coursera.org' },
      { title: 'AI for Everyone', description: 'Non-technical introduction to AI.', duration: '4 weeks', level: 'beginner', category: 'ai', goal: 'academic', rating: 4.7, provider: 'Coursera', link: 'https://coursera.org' },
      { title: 'Building GPT Models', description: 'Learn to train LLMs.', duration: '12 weeks', level: 'advanced', category: 'ai', goal: 'skill', rating: 4.9, provider: 'Fast.ai', link: 'https://fast.ai' },
      { title: 'CompTIA Security+', description: 'Get certified in cybersecurity.', duration: '8 weeks', level: 'beginner', category: 'cyber', goal: 'certification', rating: 4.6, provider: 'Cybrary', link: 'https://cybrary.it' },
      { title: 'Ethical Hacking Bootcamp', description: 'Learn penetration testing.', duration: '10 weeks', level: 'intermediate', category: 'cyber', goal: 'job', rating: 4.8, provider: 'Udemy', link: 'https://udemy.com' },
      { title: 'AWS Cloud Practitioner', description: 'Intro to AWS cloud.', duration: '6 weeks', level: 'beginner', category: 'cloud', goal: 'certification', rating: 4.7, provider: 'AWS Training', link: 'https://aws.amazon.com/training/' },
      { title: 'Cloud Architecture via Azure', description: 'Design complex cloud systems.', duration: '12 weeks', level: 'advanced', category: 'cloud', goal: 'job', rating: 4.8, provider: 'Microsoft Learn', link: 'https://learn.microsoft.com' },
      { title: 'Flutter App Development', description: 'Build cross-platform apps.', duration: '10 weeks', level: 'beginner', category: 'mobile', goal: 'skill', rating: 4.8, provider: 'Udemy', link: 'https://udemy.com' },
      { title: 'Advanced iOS with Swift', description: 'Deep dive into iOS frameworks.', duration: '14 weeks', level: 'advanced', category: 'mobile', goal: 'job', rating: 4.9, provider: 'Pluralsight', link: 'https://pluralsight.com' }
    ];

    await Course.deleteMany({});
    await Course.insertMany(sampleCourses);
    res.send('<h1>✅ Database Successfully Seeded!</h1><p>You can now go back to the app and generate recommendations.</p>');
  } catch (err) {
    res.status(500).send('Error seeding database: ' + err.message);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

