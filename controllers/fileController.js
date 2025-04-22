const { File } = require('../models');

const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

/**
 * Upload a new image file.
 *  Validates file presence and type.
 *  Saves image buffer and metadata to DB.
 */
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
      image: buffer,
    });

    res.status(201).json(newFile);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during file upload' });
  }
};

/**
 * Fetch all uploaded files.
 *  Returns list of files sorted by upload date (most recent first).
 */
exports.getAll = async (req, res) => {
  try {
    const files = await File.findAll({
      order: [['upload_date', 'ASC']],
    });
    res.json(files);
  } catch (err) {
    console.error('Get all error:', err);
    res.status(500).json({ error: 'Error fetching files' });
  }
};

/**
 * Serve image binary by file ID.
 *  Sets appropriate content type and streams binary data.
 */
exports.getImage = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.set('Content-Type', 'image/jpeg'); // or detect MIME if stored
    res.send(file.image);
  } catch (err) {
    console.error('Get image error:', err);
    res.status(500).json({ error: 'Error fetching image' });
  }
};

/**
 * Update a file's name or image.
 *  If new image uploaded, validates type and updates buffer.
 *  Updates modified date.
 */
exports.update = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const { name } = req.body;
    const uploadedFile = req.file;

    if (name) file.name = name;

    if (uploadedFile) {
      const { originalname, mimetype, buffer } = uploadedFile;

      if (!ALLOWED_TYPES.includes(mimetype)) {
        return res.status(400).json({ error: 'Only PNG and JPEG images are allowed' });
      }

      file.filename = originalname;
      file.image = buffer;
    }

    file.modified_date = new Date();
    await file.save();

    res.json(file);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Error updating file' });
  }
};

/**
 * Delete a file by ID.
 *  If file exists, removes it from DB.
 */
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
