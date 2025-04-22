const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/fileController');

// Configure multer to store uploaded file in memory as a buffer
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   POST /api/files
 * Upload a new image file
 *  Uses multer middleware to handle single file with field name 'image'
 */
router.post('/', upload.single('image'), controller.upload);

/**
 * @route   GET /api/files
 *  Get all uploaded files (metadata)
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/files/image/:id
 * Get image binary data by ID used for displaying image
 */
router.get('/image/:id', controller.getImage);

/**
 * @route   PUT /api/files/:id
 * Update file name and/or image by ID
 *  Also uses multer to handle optional image upload
 */
router.put('/:id', upload.single('image'), controller.update);

/**
 * @route   DELETE /api/files/:id
 * Delete a file by ID
 */
router.delete('/:id', controller.delete);

module.exports = router;
