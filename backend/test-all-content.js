const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import models
const Blog = require('./models/Blog');
const Snippet = require('./models/Snippet');
const Dataset = require('./models/Dataset');
const File = require('./models/File');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host} ✅`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

// Create a test user if none exists
const createTestUser = async () => {
  try {
    // Check if test user exists
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Test user created ✅');
    } else {
      console.log('Test user already exists ✅');
    }
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    return null;
  }
};

// Create test content items
const createTestContent = async (userId) => {
  try {
    // Create test blog
    const blog = await Blog.create({
      title: 'Test Blog Post',
      content: 'This is a test blog post to verify database connectivity.',
      summary: 'Testing database connectivity',
      tags: ['test', 'database', 'mongodb'],
      author: userId,
      featured: true
    });
    console.log('Test blog created ✅');
    
    // Create test snippet
    const snippet = await Snippet.create({
      title: 'Test Code Snippet',
      description: 'A simple Python function to test database connectivity',
      code: 'def test_function():\n    print("Database connection successful!")\n    return True',
      language: 'python',
      tags: ['python', 'test', 'function'],
      user: userId
    });
    console.log('Test snippet created ✅');
    
    // Create test dataset
    const dataset = await Dataset.create({
      title: 'Test Dataset',
      description: 'A sample dataset for testing',
      source: 'Test Source',
      dataFormat: 'CSV',
      size: 1024,
      downloadUrl: 'https://example.com/test-dataset.csv',
      tags: ['test', 'sample', 'data'],
      user: userId
    });
    console.log('Test dataset created ✅');
    
    // Create test file
    const file = await File.create({
      title: 'Test File',
      description: 'A test file for database verification',
      fileUrl: '/uploads/test-file.pdf',
      fileType: 'application/pdf',
      fileSize: 2048,
      tags: ['pdf', 'test', 'document'],
      user: userId
    });
    console.log('Test file created ✅');
    
    return { blog, snippet, dataset, file };
  } catch (error) {
    console.error('Error creating test content:', error.message);
    console.error(error.stack);
    return {};
  }
};

// List all content in the database
const listAllContent = async () => {
  try {
    // Count content
    const blogCount = await Blog.countDocuments();
    const snippetCount = await Snippet.countDocuments();
    const datasetCount = await Dataset.countDocuments();
    const fileCount = await File.countDocuments();
    
    console.log('\nContent in Database:');
    console.log('===================');
    console.log(`Blogs: ${blogCount}`);
    console.log(`Snippets: ${snippetCount}`);
    console.log(`Datasets: ${datasetCount}`);
    console.log(`Files: ${fileCount}`);
    console.log(`Total: ${blogCount + snippetCount + datasetCount + fileCount}`);
    
    // List some recent content
    console.log('\nRecent Content:');
    console.log('==============');
    
    const blogs = await Blog.find().limit(3).sort({ createdAt: -1 }).populate('author', 'username');
    console.log('\nRecent Blogs:');
    blogs.forEach(blog => console.log(`- ${blog.title} by ${blog.author.username}`));
    
    const snippets = await Snippet.find().limit(3).sort({ createdAt: -1 }).populate('user', 'username');
    console.log('\nRecent Snippets:');
    snippets.forEach(snippet => console.log(`- ${snippet.title} by ${snippet.user.username}`));
    
    return {
      blogCount,
      snippetCount,
      datasetCount,
      fileCount
    };
  } catch (error) {
    console.error('Error listing content:', error.message);
    return {
      blogCount: 0,
      snippetCount: 0, 
      datasetCount: 0,
      fileCount: 0
    };
  }
};

// Run the test
const runTest = async () => {
  // Connect to MongoDB
  const connected = await connectDB();
  
  if (!connected) {
    console.error('Exiting due to MongoDB connection failure');
    process.exit(1);
  }
  
  // Create test user
  const user = await createTestUser();
  
  if (!user) {
    console.error('Exiting due to user creation failure');
    process.exit(1);
  }
  
  // Create test content
  const content = await createTestContent(user._id);
  
  // List all content
  await listAllContent();
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('\nMongoDB disconnected ✅');
  console.log('\nTest completed successfully ✅');
};

// Execute the test
runTest().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 