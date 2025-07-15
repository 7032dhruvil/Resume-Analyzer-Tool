// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const subscribeRoutes = require('./routes/subscribe');
const analyzeRoutes = require('./routes/analyze');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api', analyzeRoutes);

// Error handler
app.use((error, req, res, next) => {
  res.status(500).json({ error: 'Internal server error', message: error.message });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  }))
  .catch(err => console.error('MongoDB connection error:', err)); 
