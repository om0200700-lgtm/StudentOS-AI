const CodingProfile = require('../models/CodingProfile');

// @desc    Get coding profile
// @route   GET /api/coding
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await CodingProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await CodingProfile.create({ user: req.user.id });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coding profile
// @route   PUT /api/coding
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await CodingProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await CodingProfile.create({ user: req.user.id });
    }
    
    // Deep merge updates
    const { stats, topics, platforms, streak } = req.body;
    
    if (stats) profile.stats = { ...profile.stats.toObject(), ...stats };
    if (topics) profile.topics = { ...profile.topics.toObject(), ...topics };
    if (platforms) profile.platforms = { ...profile.platforms.toObject(), ...platforms };
    if (streak !== undefined) profile.streak = streak;

    await profile.save();
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
