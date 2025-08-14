const AuthAPI = {
    async login(credentials) {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            
            if (response.token && response.user) {
                Auth.setToken(response.token);
                Auth.setUser(response.user);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.REGISTER, userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await APIClient.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            Auth.logout();
        }
    },

    async getCurrentUser() {
        try {
            const response = await APIClient.get(ENDPOINTS.AUTH.ME);
            
            if (response.user) {
                Auth.setUser(response.user);
            }
            
            return response.user;
        } catch (error) {
            Auth.logout();
            throw error;
        }
    },

    async checkTokenValidity() {
        try {
            await this.getCurrentUser();
            return true;
        } catch (error) {
            return false;
        }
    }
};