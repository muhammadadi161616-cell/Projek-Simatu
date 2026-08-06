const db = require('../config/db');

class ActivityLog {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.task_id = data.task_id;
        this.action = data.action;
        this.details = data.details;
        this.user_name = data.user_name || null;
        this.task_title = data.task_title || null;
        this.created_at = data.created_at;
    }

    static async create({ user_id, task_id, action, details }) {
        await db.execute(
            'INSERT INTO activity_logs (user_id, task_id, action, details) VALUES (?, ?, ?, ?)',
            [user_id, task_id || null, action, details || null]
        );
    }

    static async findAll({ userId, role }) {
        let query = `
            SELECT l.*, u.name as user_name, t.title as task_title 
            FROM activity_logs l 
            JOIN users u ON l.user_id = u.id 
            LEFT JOIN tasks t ON l.task_id = t.id 
            WHERE 1=1
        `;
        const params = [];

        if (role !== 'admin') {
            query += ' AND l.user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY l.created_at DESC LIMIT 50';

        const [rows] = await db.execute(query, params);
        return rows.map(row => new ActivityLog(row));
    }
}

module.exports = ActivityLog;
