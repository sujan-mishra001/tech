const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true, // Always use secure cookies
  sameSite: 'none', // Required for cross-origin
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      // Set token in cookie
      res.cookie('token', token, cookieOptions);

      // Set Authorization header
      res.setHeader('Authorization', `Bearer ${token}`);

      // Send response
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          darkMode: user.darkMode,
          token
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);
      
    // Set token in cookie
    res.cookie('token', token, cookieOptions);

    // Set Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Send response
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        darkMode: user.darkMode,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.error('No user in request:', req.user);
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.error('User not found for ID:', req.user._id);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        darkMode: user.darkMode
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  try {    res.cookie('token', 'none', {
      expires: new Date(Date.now()),
      ...cookieOptions
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (typeof req.body.darkMode === 'boolean') user.darkMode = req.body.darkMode;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        darkMode: updatedUser.darkMode
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};