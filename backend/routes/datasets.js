const express = require('express');
const { check } = require('express-validator');
const { getDatasets, getDataset, createDataset, updateDataset, deleteDataset } = require('../controllers/datasetController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all datasets and create new dataset
router
  .route('/')
  .get(getDatasets)
  .post(
    protect,
    upload.single('datasetFile'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('fileType', 'File type is required').not().isEmpty()
    ],
    createDataset
  );

// Get, update and delete single dataset
router
  .route('/:id')
  .get(getDataset)
  .put(protect, updateDataset)
  .delete(protect, deleteDataset);

module.exports = router; 