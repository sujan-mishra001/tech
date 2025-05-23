const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Blog = require('./models/Blog');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully ✅');
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

// Create a test blog post
const createTestBlog = async (userId) => {
  try {
    const blog = await Blog.create({
      title: 'Test Blog Post',
      content: 'This is a test blog post to verify database connectivity.',
      summary: 'Testing database connectivity',
      tags: ['test', 'database', 'mongodb'],
      author: userId,
      featured: true
    });
    
    console.log('Test blog created ✅');
    console.log(blog);
    return blog;
  } catch (error) {
    console.error('Error creating test blog:', error.message);
    return null;
  }
};

// List all blogs in the database
const listAllBlogs = async () => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    console.log('\nAll blogs in database:');
    console.log('======================');
    
    if (blogs.length === 0) {
      console.log('No blogs found in database');
    } else {
      blogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title} by ${blog.author.username} (${blog.createdAt})`);
      });
    }
    
    return blogs;
  } catch (error) {
    console.error('Error listing blogs:', error.message);
    return [];
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
  
  // Create test blog
  const blog = await createTestBlog(user._id);
  
  // List all blogs
  await listAllBlogs();
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('\nMongoDB disconnected ✅');
};

// Execute the test
runTest().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 