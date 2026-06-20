const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('express-async-errors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const providerRoutes = require('./routes/providerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

// --- UPDATED CORS FOR SERVERLESS DEPLOYMENT ---
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req, res) => {
  try {
    await connectDB(); 
    
    const states = {
      0: "Disconnected",
      1: "Connected and Running",
      2: "Connecting...",
      3: "Disconnecting..."
    };
    
    const dbStatus = states[mongoose.connection.readyState] || "Unknown State";

    res.status(200).json({
      status: 'success',
      message: 'GigVera Backend is Live and Running Successfully!',
      database: dbStatus,
      builtBy: 'Muhammad Okasha'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Backend is running but MongoDB failed to connect',
      error: err.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1 ? "ok" : "error";
    res.json({ 
      status: 'ok', 
      message: 'GIGVERA API is running',
      database: dbStatus 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'error' });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GIGVERA server running on port ${PORT}`);
});
