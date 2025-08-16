const AuthAPI = {
    async login(credentials) {
        try {
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            
            if (response.token) {
                Auth.setToken(response.token);
                Auth.setUser({
                    email: response.email,
                    nickname: response.nickname,
                    isAdmin: response.isAdmin
                });
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            console.log('Sending register request:', userData);
            const response = await APIClient.post(ENDPOINTS.AUTH.REGISTER, userData);
            console.log('Register response:', response);
            return response;
        } catch (error) {
            console.error('Register API error:', error);
            throw error;
        }
    },

    async logout() {
        try {
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            Auth.logout();
        }
    },

    async getCurrentUser() {
        try {
            const response = await APIClient.get(ENDPOINTS.AUTH.ME);
            
            if (response) {
                Auth.setUser({
                    email: response.email,
                    nickname: response.nickname,
                    isAdmin: response.isAdmin
                });
            }
            
            return response;
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

console.log('AuthAPI loaded');