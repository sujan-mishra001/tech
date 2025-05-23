const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: [true, 'Please provide code for the snippet']
  },
  language: {
    type: String,
    required: [true, 'Please specify the programming language'],
    enum: [
      'python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 
      'go', 'ruby', 'rust', 'swift', 'kotlin', 'php', 'r', 'sql', 'bash',
      'html', 'css', 'markdown', 'json', 'yaml', 'other'
    ]
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
SnippetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Snippet', SnippetSchema); 