const AuthAPI = {
    async login(credentials) {
        try {
            const response = await APIClient.post('/auth/login', credentials);
            
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
            const response = await APIClient.post('/auth/register', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            Auth.logout();
        } catch (error) {
            console.error('Logout API error:', error);
            Auth.logout();
        }
    },

    async getCurrentUser() {
        try {
            const response = await APIClient.get('/auth/me');
            
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