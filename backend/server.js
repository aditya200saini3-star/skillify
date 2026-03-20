
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
    const sampleCourses = require('./coursesData.json');

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

