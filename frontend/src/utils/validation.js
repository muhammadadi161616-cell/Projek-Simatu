export const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
};

export const validateName = (name) => {
    if (!name || name.trim() === '') return 'Name is required';
    return null;
};

export const validateTaskTitle = (title) => {
    if (!title || title.trim() === '') return 'Title is required';
    return null;
};
