const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const File = require('../models/File');
const { validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all files
// @route   GET /api/files
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, tag, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const files = await File.find(query)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await File.countDocuments(query);
    
    res.json({
      success: true,
      count: files.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: files
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('user', 'username avatar');
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Upload file
// @route   POST /api/files
// @access  Private
router.post(
  '/',
  protect,
  upload.single('file'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'File type is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload a file'
        });
      }
      
      // Create file record
      const file = new File({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        fileUrl: `uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        user: req.user.id
      });
      
      // Add tags if provided
      if (req.body.tags) {
        file.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
      
      await file.save();
      
      res.status(201).json({
        success: true,
        data: file
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Update file
// @route   PUT /api/files/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // Check ownership
    if (file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this file'
      });
    }
    
    // Convert tags if provided
    if (req.body.tags) {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    file = await File.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // Check ownership
    if (file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this file'
      });
    }
    
    await file.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 