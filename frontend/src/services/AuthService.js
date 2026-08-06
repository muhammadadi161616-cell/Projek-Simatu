import BaseApiService from './BaseApiService';

class AuthService extends BaseApiService {
    async register(userData) {
        const data = await this.post('/register', userData);
        if (data.token) {
            localStorage.setItem('simatu_token', data.token);
            localStorage.setItem('simatu_user', JSON.stringify(data.user));
        }
        return data;
    }

    async login(credentials) {
        const data = await this.post('/login', credentials);
        if (data.token) {
            localStorage.setItem('simatu_token', data.token);
            localStorage.setItem('simatu_user', JSON.stringify(data.user));
        }
        return data;
    }

    async logout() {
        try {
            await this.post('/logout');
        } catch (e) {
            console.error('Logout error on server:', e);
        } finally {
            localStorage.removeItem('simatu_token');
            localStorage.removeItem('simatu_user');
        }
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('simatu_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('simatu_token');
    }
}

export default new AuthService();
