const PlacementPrep = require('../models/PlacementPrep');

// @desc    Get placement preparation status
// @route   GET /api/placement
// @access  Private
exports.getPrep = async (req, res, next) => {
  try {
    let prep = await PlacementPrep.findOne({ user: req.user.id });
    if (!prep) {
      prep = await PlacementPrep.create({ user: req.user.id });
    }
    res.status(200).json({ success: true, data: prep });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement preparation status
// @route   PUT /api/placement
// @access  Private
exports.updatePrep = async (req, res, next) => {
  try {
    let prep = await PlacementPrep.findOne({ user: req.user.id });
    if (!prep) {
      prep = await PlacementPrep.create({ user: req.user.id });
    }

    const { dsa, coreSubjects, aptitude, portfolio, projects, interviews } = req.body;

    if (dsa) prep.dsa = { ...prep.dsa.toObject(), ...dsa };
    if (coreSubjects) prep.coreSubjects = { ...prep.coreSubjects.toObject(), ...coreSubjects };
    if (aptitude) prep.aptitude = { ...prep.aptitude.toObject(), ...aptitude };
    if (portfolio) prep.portfolio = { ...prep.portfolio.toObject(), ...portfolio };
    if (projects) prep.projects = { ...prep.projects.toObject(), ...projects };
    if (interviews) prep.interviews = { ...prep.interviews.toObject(), ...interviews };

    await prep.save();
    res.status(200).json({ success: true, data: prep });
  } catch (error) {
    next(error);
  }
};
