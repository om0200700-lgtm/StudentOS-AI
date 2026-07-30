const mongoose = require('mongoose');

const placementPrepSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dsa: {
    arrays: { type: Boolean, default: false },
    strings: { type: Boolean, default: false },
    linkedLists: { type: Boolean, default: false },
    trees: { type: Boolean, default: false },
    graphs: { type: Boolean, default: false },
    dp: { type: Boolean, default: false }
  },
  coreSubjects: {
    os: { type: Boolean, default: false },
    dbms: { type: Boolean, default: false },
    cn: { type: Boolean, default: false },
    oops: { type: Boolean, default: false },
    sql: { type: Boolean, default: false }
  },
  aptitude: {
    quant: { type: Boolean, default: false },
    logical: { type: Boolean, default: false },
    verbal: { type: Boolean, default: false }
  },
  portfolio: {
    resume: { type: Boolean, default: false },
    github: { type: Boolean, default: false },
    linkedin: { type: Boolean, default: false },
    portfolioWebsite: { type: Boolean, default: false }
  },
  projects: {
    project1: { type: Boolean, default: false },
    project2: { type: Boolean, default: false }
  },
  interviews: {
    mock1: { type: Boolean, default: false },
    mock2: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlacementPrep', placementPrepSchema);
