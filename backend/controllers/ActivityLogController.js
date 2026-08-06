const ActivityLog = require('../models/ActivityLog');

class ActivityLogController {
    static async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const logs = await ActivityLog.findAll({ userId, role });
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ActivityLogController;
