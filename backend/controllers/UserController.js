const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

class UserController {
    static async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const userId = await User.create({
                name,
                email,
                password: hashedPassword,
                role
            });

            // Fetch created user
            const newUser = await User.findById(userId);

            // Generate JWT Token
            const token = jwt.sign(
                { id: newUser.id, role: newUser.role },
                process.env.JWT_SECRET || 'supersecretkeyforsimatuprojectuas',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Log activity
            await ActivityLog.create({
                user_id: newUser.id,
                action: 'REGISTER',
                details: `User registered with email ${email}`
            });

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'supersecretkeyforsimatuprojectuas',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Log activity
            await ActivityLog.create({
                user_id: user.id,
                action: 'LOGIN',
                details: `User logged in`
            });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const userId = req.user.id;
            
            // Log activity
            await ActivityLog.create({
                user_id: userId,
                action: 'LOGOUT',
                details: `User logged out`
            });

            res.json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
