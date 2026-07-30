const ActivityLog = require('../models/ActivityLog');

const logActivity = (action, entity) => {
  return async (req, res, next) => {
    // We want to log after the response finishes, so we can capture success/failure and the entityId if newly created
    res.on('finish', async () => {
      // Only log on success (2xx or 3xx)
      if (res.statusCode >= 200 && res.statusCode < 400 && req.user) {
        try {
          // Attempt to extract entityId from req.params or res.locals (if set by controller)
          const entityId = req.params.id || (res.locals.createdEntity ? res.locals.createdEntity._id : null);
          
          await ActivityLog.create({
            user: req.user._id,
            action: action,
            entity: entity,
            entityId: entityId,
            details: { method: req.method, path: req.originalUrl },
            ipAddress: req.ip
          });
        } catch (error) {
          console.error('Failed to log activity:', error);
        }
      }
    });
    next();
  };
};

module.exports = logActivity;
