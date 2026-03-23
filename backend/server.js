
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logFile = path.join(__dirname, 'connection.log');
function log(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}

log('Server starting...');
log('MONGODB_URI exists: ' + !!process.env.MONGODB_URI);

console.log('Environment Loaded. MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
  console.log('Connecting to:', maskedUri);
}

const authRoutes = require('./routes/auth');
const recommendRoutes = require('./routes/recommend');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Mongoose debug mode
mongoose.set('debug', true);

// MongoDB Connection (Moved to Top)
log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    log('✅ MongoDB Connected Successfully');
    log('Database Name: ' + mongoose.connection.name);
  })
  .catch(err => {
    log('❌ MongoDB Connection Error');
    log(err.message);
  });

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
  res.json({ message: 'CourseMatch Backend Ready! 🎯' });
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

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

