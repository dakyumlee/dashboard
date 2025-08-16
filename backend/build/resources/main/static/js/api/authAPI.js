const AuthAPI = {
    async login(credentials) {
        try {
            console.log('로그인 시도:', credentials.email);
            const response = await APIClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            
            if (response.token) {
                Auth.setToken(response.token);
                Auth.setUser({
                    email: response.email,
                    nickname: response.nickname,
                    isAdmin: response.isAdmin
                });
                console.log('로그인 성공, 메인 페이지로 이동');
                window.location.href = 'index.html';
            }
            
            return response;
        } catch (error) {
            console.error('로그인 오류:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            console.log('회원가입 시도:', userData.email);
            const response = await APIClient.post(ENDPOINTS.AUTH.REGISTER, userData);
            console.log('회원가입 응답:', response);
            return response;
        } catch (error) {
            console.error('회원가입 오류:', error);
            throw error;
        }
    },

    async logout() {
        try {
            console.log('로그아웃 처리');
        } catch (error) {
            console.error('로그아웃 오류:', error);
        } finally {
            Auth.logout();
            window.location.href = 'login.html';
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