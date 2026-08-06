const db = require('../config/db');

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    static async create({ name, email, password, role }) {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role || 'user']
        );
        return result.insertId;
    }
}

module.exports = User;
