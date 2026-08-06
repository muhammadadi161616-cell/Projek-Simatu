const db = require('../config/db');

class Task {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status;
        this.priority = data.priority;
        this.due_date = data.due_date;
        this.user_id = data.user_id;
        this.creator_name = data.creator_name || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findAll({ search, status, priority, userId, role }) {
        let query = `
            SELECT t.*, u.name as creator_name 
            FROM tasks t 
            JOIN users u ON t.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        // Role-based authorization
        if (role !== 'admin') {
            query += ' AND t.user_id = ?';
            params.push(userId);
        }

        // Search query
        if (search) {
            query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
            const searchVal = `%${search}%`;
            params.push(searchVal, searchVal);
        }

        // Filters
        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND t.priority = ?';
            params.push(priority);
        }

        query += ' ORDER BY t.created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows.map(row => new Task(row));
    }

    static async findById(id) {
        const query = `
            SELECT t.*, u.name as creator_name 
            FROM tasks t 
            JOIN users u ON t.user_id = u.id 
            WHERE t.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length === 0) return null;
        return new Task(rows[0]);
    }

    static async create({ title, description, status, priority, due_date, user_id }) {
        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || null, status || 'Pending', priority || 'Medium', due_date || null, user_id]
        );
        return result.insertId;
    }

    static async update(id, { title, description, status, priority, due_date }) {
        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
            [title, description || null, status, priority, due_date || null, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    }

    static async getStatistics(userId, role) {
        let countQuery = 'SELECT COUNT(*) as total FROM tasks';
        let statusQuery = 'SELECT status, COUNT(*) as count FROM tasks';
        let priorityQuery = 'SELECT priority, COUNT(*) as count FROM tasks';
        const params = [];

        if (role !== 'admin') {
            countQuery += ' WHERE user_id = ?';
            statusQuery += ' WHERE user_id = ?';
            priorityQuery += ' WHERE user_id = ?';
            params.push(userId);
        }

        statusQuery += ' GROUP BY status';
        priorityQuery += ' GROUP BY priority';

        const [[countResult]] = await db.execute(countQuery, params);
        const [statusResult] = await db.execute(statusQuery, params);
        const [priorityResult] = await db.execute(priorityQuery, params);

        return {
            total: countResult.total,
            statusStats: statusResult,
            priorityStats: priorityResult
        };
    }
}

module.exports = Task;
