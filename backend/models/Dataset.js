const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a dataset name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['csv', 'json', 'xlsx', 'parquet', 'sql', 'txt', 'zip', 'other']
  },
  fileSize: {
    type: Number
  },
  columns: {
    type: [String],
    default: []
  },
  rowCount: {
    type: Number
  },
  license: {
    type: String,
    default: 'Unknown'
  },
  source: {
    type: String
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
DatasetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dataset', DatasetSchema); 