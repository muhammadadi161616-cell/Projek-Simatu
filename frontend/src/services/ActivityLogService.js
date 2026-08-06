import BaseApiService from './BaseApiService';

class ActivityLogService extends BaseApiService {
    async getAll() {
        return await this.get('/logs');
    }
}

export default new ActivityLogService();
