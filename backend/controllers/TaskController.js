const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

class TaskController {
    static async getAll(req, res, next) {
        try {
            const { search, status, priority } = req.query;
            const userId = req.user.id;
            const role = req.user.role;

            const tasks = await Task.findAll({
                search,
                status,
                priority,
                userId,
                role
            });

            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;
            const role = req.user.role;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Authorization check
            if (role !== 'admin' && task.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied: You do not own this task' });
            }

            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { title, description, status, priority, due_date, assignee_id } = req.body;
            const userId = req.user.id;
            const role = req.user.role;

            // If admin and assignee_id is provided, use assignee_id. Otherwise use current user's id.
            const targetUserId = (role === 'admin' && assignee_id) ? parseInt(assignee_id) : userId;

            const taskId = await Task.create({
                title,
                description,
                status,
                priority,
                due_date,
                user_id: targetUserId
            });

            // Log activity
            await ActivityLog.create({
                user_id: userId,
                task_id: taskId,
                action: 'CREATE_TASK',
                details: `Created task "${title}"`
            });

            const newTask = await Task.findById(taskId);
            res.status(201).json({
                message: 'Task created successfully',
                task: newTask
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const taskId = req.params.id;
            const { title, description, status, priority, due_date } = req.body;
            const userId = req.user.id;
            const role = req.user.role;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Authorization check
            if (role !== 'admin' && task.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied: You do not own this task' });
            }

            await Task.update(taskId, {
                title: title || task.title,
                description: description !== undefined ? description : task.description,
                status: status || task.status,
                priority: priority || task.priority,
                due_date: due_date || task.due_date
            });

            // Log activity
            await ActivityLog.create({
                user_id: userId,
                task_id: taskId,
                action: 'UPDATE_TASK',
                details: `Updated task "${title || task.title}"`
            });

            const updatedTask = await Task.findById(taskId);
            res.json({
                message: 'Task updated successfully',
                task: updatedTask
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;
            const role = req.user.role;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Authorization check
            if (role !== 'admin' && task.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied: You do not own this task' });
            }

            await Task.delete(taskId);

            // Log activity
            await ActivityLog.create({
                user_id: userId,
                action: 'DELETE_TASK',
                details: `Deleted task "${task.title}"`
            });

            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const stats = await Task.getStatistics(userId, role);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TaskController;
