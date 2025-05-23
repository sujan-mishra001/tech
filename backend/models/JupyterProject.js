const mongoose = require('mongoose');

const JupyterProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  content: {
    type: String // Could be rendered HTML or JSON content
  },
  notebookUrl: {
    type: String,
    required: [true, 'Notebook URL is required']
  },
  language: {
    type: String,
    enum: ['python', 'r', 'julia', 'scala', 'other'],
    default: 'python'
  },
  packages: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
JupyterProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JupyterProject', JupyterProjectSchema); 