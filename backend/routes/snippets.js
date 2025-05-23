const express = require('express');
const { check } = require('express-validator');
const { getSnippets, getSnippet, createSnippet, updateSnippet, deleteSnippet } = require('../controllers/snippetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all snippets and create new snippet
router
  .route('/')
  .get(getSnippets)
  .post(
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('code', 'Code is required').not().isEmpty(),
      check('language', 'Language is required').not().isEmpty()
    ],
    createSnippet
  );

// Get, update and delete single snippet
router
  .route('/:id')
  .get(getSnippet)
  .put(protect, updateSnippet)
  .delete(protect, deleteSnippet);

module.exports = router; 