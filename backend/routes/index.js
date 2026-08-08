const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const TaskController = require('../controllers/TaskController');
const ActivityLogController = require('../controllers/ActivityLogController');

const { auth } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateTask } = require('../middleware/validationMiddleware');

// Authentication routes
router.post('/register', validateRegister, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.post('/logout', auth, UserController.logout);

// Task CRUD routes
router.get('/data', auth, TaskController.getAll);
router.get('/data/:id', auth, TaskController.getById);
router.post('/data', auth, validateTask, TaskController.create);
router.put('/data/:id', auth, validateTask, TaskController.update);
router.delete('/data/:id', auth, TaskController.delete);

// Dashboard Statistics, Users & Activity Logs routes
router.get('/stats', auth, TaskController.getStats);
router.get('/logs', auth, ActivityLogController.getAll);
router.get('/users', auth, UserController.listUsers);

module.exports = router;
