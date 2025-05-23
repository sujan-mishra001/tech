const Snippet = require('../models/Snippet');
const { validationResult } = require('express-validator');

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Public
exports.getSnippets = async (req, res) => {
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
    
    const snippets = await Snippet.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Snippet.countDocuments(query);
    
    res.json({
      success: true,
      count: snippets.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: snippets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single snippet
// @route   GET /api/snippets/:id
// @access  Public
exports.getSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('author', 'username avatar');
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    res.json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
exports.createSnippet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Add user to req.body
    req.body.author = req.user.id;
    
    const snippet = await Snippet.create(req.body);
    
    res.status(201).json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
exports.updateSnippet = async (req, res) => {
  try {
    let snippet = await Snippet.findById(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    // Make sure user is snippet owner or admin
    if (snippet.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this snippet'
      });
    }
    
    snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    // Make sure user is snippet owner or admin
    if (snippet.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this snippet'
      });
    }
    
    await snippet.deleteOne();
    
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
}; 