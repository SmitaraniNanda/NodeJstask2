const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/fileController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), controller.upload);
router.get('/', controller.getAll);
router.get('/image/:id', controller.getImage);
router.put('/:id', upload.single('image'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
