const { File } = require('../models');

// Allowed image types
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

// Upload new image
exports.upload = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, mimetype, buffer } = file;

    if (!ALLOWED_TYPES.includes(mimetype)) {
      return res.status(400).json({ error: 'Only PNG and JPEG images are allowed' });
    }

    const newFile = await File.create({
      name,
      filename: originalname,
      image: buffer
    });

    res.status(201).json(newFile);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during file upload' });
  }
};

//  Get all images in DESCENDING order
exports.getAll = async (req, res) => {
  try {
    const files = await File.findAll({
      order: [['upload_date', 'DESC']] // Sort by newest first
    });
    res.json(files);
  } catch (err) {
    console.error('Get all error:', err);
    res.status(500).json({ error: 'Error fetching files' });
  }
};

// Get a single image
exports.getImage = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const contentType = file.filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    res.send(file.image);
  } catch (err) {
    console.error('Get image error:', err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
};

// Update image and name
exports.update = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const { name } = req.body;
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded for update' });
    }

    const { originalname, mimetype, buffer } = uploadedFile;

    if (!ALLOWED_TYPES.includes(mimetype)) {
      return res.status(400).json({ error: 'Only PNG and JPEG images are allowed' });
    }

    file.name = name;
    file.filename = originalname;
    file.image = buffer;
    file.modified_date = new Date();

    await file.save();
    res.json(file);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Error updating file' });
  }
};

// Delete image
exports.delete = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    await file.destroy();
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Error deleting file' });
  }
};
