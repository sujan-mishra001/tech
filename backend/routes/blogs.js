const express = require('express');
const { check } = require('express-validator');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, getUserBlogs } = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all blogs and create new blog
router
  .route('/')
  .get(getBlogs)
  .post(
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ],
    createBlog
  );

// Get, update and delete single blog
router
  .route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

// Get blogs by user
router.get('/user/:userId', getUserBlogs);

module.exports = router;