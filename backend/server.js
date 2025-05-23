const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://tech-five-ashy.vercel.app', 'https://tech-yb09.onrender.com']
      : ['http://localhost:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blogs');
const fileRoutes = require('./routes/files');
const jupyterRoutes = require('./routes/jupyter');
const snippetRoutes = require('./routes/snippets');
const datasetRoutes = require('./routes/datasets');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/jupyter', jupyterRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/datasets', datasetRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Data Science Hub API is running!');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/data_science_hub');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Set up port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});