const AuthAPI = {
    async register(userData) {
        return await apiClient.post('/auth/register', userData);
    },

    async login(credentials) {
        return await apiClient.post('/auth/login', credentials);
    },

    async getCurrentUser() {
        return await apiClient.get('/auth/me');
    },

    async logout() {
        return await apiClient.post('/auth/logout');
    },

    async refreshToken() {
        return await apiClient.post('/auth/refresh');
    }
};