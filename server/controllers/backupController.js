const mongoose = require('mongoose');

// Export all collections to JSON
exports.exportBackup = async (req, res) => {
  try {
    const backupData = {};
    const models = mongoose.modelNames();

    for (const modelName of models) {
      const Model = mongoose.model(modelName);
      const data = await Model.find({});
      backupData[modelName] = data;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=studentos_backup_${Date.now()}.json`);
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error('Backup Export Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate backup' });
  }
};

// Import collections from JSON
exports.importBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Backup file is required' });
    }
    
    const backupData = JSON.parse(req.file.buffer.toString());
    const models = mongoose.modelNames();

    // WARNING: This clears existing data and overwrites. For real production, use careful merging.
    for (const modelName of Object.keys(backupData)) {
      if (models.includes(modelName)) {
        const Model = mongoose.model(modelName);
        await Model.deleteMany({});
        if (backupData[modelName].length > 0) {
          await Model.insertMany(backupData[modelName]);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Backup restored successfully' });
  } catch (error) {
    console.error('Backup Import Error:', error);
    res.status(500).json({ success: false, error: 'Failed to restore backup' });
  }
};
