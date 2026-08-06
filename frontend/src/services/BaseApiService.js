import axios from 'axios';

class BaseApiService {
    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Set auth token dynamically on request
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('simatu_token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Global response error handler
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                const message = error.response?.data?.message || error.message || 'An error occurred';
                const errors = error.response?.data?.errors || null;
                
                // Return formatted error object
                return Promise.reject({
                    status: error.response?.status || 500,
                    message,
                    errors
                });
            }
        );
    }

    async get(url, params = {}) {
        const response = await this.api.get(url, { params });
        return response.data;
    }

    async post(url, data = {}) {
        const response = await this.api.post(url, data);
        return response.data;
    }

    async put(url, data = {}) {
        const response = await this.api.put(url, data);
        return response.data;
    }

    async delete(url) {
        const response = await this.api.delete(url);
        return response.data;
    }
}

export default BaseApiService;
