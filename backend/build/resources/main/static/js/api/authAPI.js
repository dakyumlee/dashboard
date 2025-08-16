const AuthAPI = {
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

    async login(loginData) {
        try {
            console.log('Sending login request:', loginData);
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, loginData);
            console.log('Login response:', response);
            return response;
        } catch (error) {
            console.error('Login API error:', error);
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

    async logout() {
        try {
            await APIClient.post(ENDPOINTS.AUTH.LOGOUT);
            Auth.setToken(null);
            Auth.setUser(null);
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};

console.log('AuthAPI loaded');