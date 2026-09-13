const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logging for debugging ESP32 → Backend communication
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${req.headers['x-device-id'] || ''}`);
  next();
});

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'JalRakshak API is running' });
});

// Import Routes
const telemetryRoutes = require('./routes/telemetryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const notificationRoutes = require('./routes/notifications');

// Use Routes
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 so ESP32 and other LAN devices can reach this server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
