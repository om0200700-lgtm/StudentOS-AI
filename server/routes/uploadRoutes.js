const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/upload/avatar
// @desc    Upload profile avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file' });
    }

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      fileUrl,
      user
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// @route   POST /api/upload/document
// @desc    Upload document
// @access  Private
router.post('/document', protect, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a document file' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      fileUrl,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

module.exports = router;
