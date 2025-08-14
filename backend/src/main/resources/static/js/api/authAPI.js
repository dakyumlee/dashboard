const AuthAPI = {
    async login(credentials) {
        try {
            console.log('Sending login request:', credentials);
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            console.log('Login response:', response);
            
            if (response.success && response.user) {
                Auth.setUser(response.user);
                return response;
            } else {
                throw new Error(response.message || '로그인 실패');
            }
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
            
            if (response.success) {
                return response;
            } else {
                throw new Error(response.message || '회원가입 실패');
            }
        } catch (error) {
            console.error('Register API error:', error);
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
            
            if (response.success && response.user) {
                Auth.setUser(response.user);
                return response.user;
            } else {
                throw new Error(response.message || '사용자 정보 조회 실패');
            }
        } catch (error) {
            Auth.logout();
            throw error;
        }
    },

    async checkAuth() {
        try {
            await this.getCurrentUser();
            return true;
        } catch (error) {
            return false;
        }
    }
};

console.log('AuthAPI loaded');