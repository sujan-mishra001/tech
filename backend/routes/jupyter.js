const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const JupyterProject = require('../models/JupyterProject');
const { validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all jupyter projects
// @route   GET /api/jupyter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, tag, language, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by featured
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Filter by language
    if (language) {
      query.language = language;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await JupyterProject.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await JupyterProject.countDocuments(query);
    
    res.json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single jupyter project
// @route   GET /api/jupyter/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await JupyterProject.findById(req.params.id).populate('author', 'username avatar');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Jupyter project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Jupyter project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new jupyter project
// @route   POST /api/jupyter
// @access  Private
router.post(
  '/',
  protect,
  upload.single('notebookFile'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('language', 'Language is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Add user to req.body
      req.body.author = req.user.id;
      
      // Add file path if uploaded
      if (req.file) {
        req.body.notebookUrl = `uploads/${req.file.filename}`;
      }
      
      const project = await JupyterProject.create(req.body);
      
      res.status(201).json({
        success: true,
        data: project
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

// @desc    Update jupyter project
// @route   PUT /api/jupyter/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await JupyterProject.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Jupyter project not found'
      });
    }
    
    // Make sure user is project owner or admin
    if (project.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }
    
    project = await JupyterProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete jupyter project
// @route   DELETE /api/jupyter/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await JupyterProject.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Jupyter project not found'
      });
    }
    
    // Make sure user is project owner or admin
    if (project.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }
    
    await project.deleteOne();
    
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