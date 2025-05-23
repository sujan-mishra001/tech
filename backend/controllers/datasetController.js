const Dataset = require('../models/Dataset');
const { validationResult } = require('express-validator');

// @desc    Get all datasets
// @route   GET /api/datasets
// @access  Public
exports.getDatasets = async (req, res) => {
  try {
    const { featured, tag, limit = 10, page = 1 } = req.query;
    
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
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const datasets = await Dataset.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Dataset.countDocuments(query);
    
    res.json({
      success: true,
      count: datasets.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: datasets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single dataset
// @route   GET /api/datasets/:id
// @access  Public
exports.getDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate('author', 'username avatar');
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }
    
    res.json({
      success: true,
      data: dataset
    });
  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new dataset
// @route   POST /api/datasets
// @access  Private
exports.createDataset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Add user to req.body
    req.body.author = req.user.id;
    
    const dataset = await Dataset.create(req.body);
    
    res.status(201).json({
      success: true,
      data: dataset
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update dataset
// @route   PUT /api/datasets/:id
// @access  Private
exports.updateDataset = async (req, res) => {
  try {
    let dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }
    
    // Make sure user is dataset owner or admin
    if (dataset.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this dataset'
      });
    }
    
    dataset = await Dataset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: dataset
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete dataset
// @route   DELETE /api/datasets/:id
// @access  Private
exports.deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }
    
    // Make sure user is dataset owner or admin
    if (dataset.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this dataset'
      });
    }
    
    await dataset.deleteOne();
    
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