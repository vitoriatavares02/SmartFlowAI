const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SmartFlow API Engine',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  🚀 ==========================================
     SmartFlow AI Automation Backend Engine
     Server running on port: ${PORT}
     API Endpoints:
     - Auth:     http://localhost:${PORT}/api/auth/login
     - Requests: http://localhost:${PORT}/api/requests
  ========================================== 🚀
  `);
});

module.exports = app;
