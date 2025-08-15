const AuthAPI = {
    async register(userData) {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.REGISTER, userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGOUT);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await APIClient.get(ENDPOINTS.AUTH.ME);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async checkAuthStatus() {
        try {
            const user = await this.getCurrentUser();
            return { isAuthenticated: true, user };
        } catch (error) {
            return { isAuthenticated: false, user: null };
        }
    }
};