const validateRegister = (req, res, next) => {
    const { name, email, password, role } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    if (role && !['admin', 'user'].includes(role)) {
        errors.push('Invalid role (must be admin or user)');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    }
    if (!password || password.trim() === '') {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateTask = (req, res, next) => {
    const { title, status, priority, due_date } = req.body;
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }
    if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
        errors.push('Status must be Pending, In Progress, or Completed');
    }
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        errors.push('Priority must be Low, Medium, or High');
    }
    if (due_date) {
        const timestamp = Date.parse(due_date);
        if (isNaN(timestamp)) {
            errors.push('Due date must be a valid date format');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateTask
};
