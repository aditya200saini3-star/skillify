
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

// MongoDB Connection & Server Start
async function startServer() {
  try {
    log('Attempting MongoDB connection...');
    console.log('Environment Loaded. MONGODB_URI exists:', !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log('Connecting to:', maskedUri);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if replica set not reached
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
    });

    log('✅ MongoDB Connected Successfully');
    log('Database Name: ' + mongoose.connection.name);
    console.log('✅ MongoDB Connected Successfully');

    app.listen(PORT, () => {
      log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    log('❌ MongoDB Connection Error');
    log(err.message);
    console.error('❌ Failed to start server:', err.message);
    process.exit(1); // Exit if we can't connect
  }
}

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

// Route registration
app.get('/', (req, res) => {
  res.json({ 
    message: 'CourseMatch Backend Ready! 🎯',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

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

app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the sequence
startServer();

module.exports = app;

