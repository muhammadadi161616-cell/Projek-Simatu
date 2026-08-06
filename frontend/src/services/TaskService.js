import BaseApiService from './BaseApiService';

class TaskService extends BaseApiService {
    async getAll(filters = {}) {
        return await this.get('/data', filters);
    }

    async getById(id) {
        return await this.get(`/data/${id}`);
    }

    async create(taskData) {
        return await this.post('/data', taskData);
    }

    async update(id, taskData) {
        return await this.put(`/data/${id}`, taskData);
    }

    async deleteTask(id) {
        return await this.delete(`/data/${id}`);
    }

    async getStats() {
        return await this.get('/stats');
    }
}

export default new TaskService();
