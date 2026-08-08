import BaseApiService from './BaseApiService';

class UserService extends BaseApiService {
    async getAll() {
        return await this.get('/users');
    }
}

export default new UserService();
