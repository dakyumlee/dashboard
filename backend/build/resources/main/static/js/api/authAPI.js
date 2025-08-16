const AuthAPI = {
    async login(credentials) {
        try {
            console.log('Sending login request:', credentials);
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            console.log('Login response:', response);
            
            if (response.success && response.data) {
                const userData = response.data;
                Auth.setToken(userData.token);
                Auth.setUser({
                    email: userData.email,
                    nickname: userData.nickname,
                    isAdmin: userData.isAdmin
                });
                
                console.log('User logged in:', userData);
            }
            
            return response;
        } catch (error) {
            console.error('Login API error:', error);
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
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGOUT);
            console.log('Logout response:', response);
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            Auth.logout();
        }
    },

    async getCurrentUser() {
        try {
            const response = await APIClient.get(ENDPOINTS.AUTH.ME);
            
            if (response.success && response.data) {
                const userData = response.data;
                Auth.setUser({
                    email: userData.email,
                    nickname: userData.nickname,
                    isAdmin: userData.isAdmin
                });
                
                return userData;
            }
            
            return response;
        } catch (error) {
            console.error('Get current user error:', error);
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