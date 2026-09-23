const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df8vbf95v',
  api_key: process.env.CLOUDINARY_API_KEY || '162897735661921',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'anHWKCwdFS-Z96_uDZPNPHR2YLA',
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Public / Private
router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'monzato_products',
      resource_type: 'auto',
    });

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
});

module.exports = router;
