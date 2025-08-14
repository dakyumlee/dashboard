const Auth = {
    getCurrentUser() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            
            if (payload.exp < now) {
                this.logout();
                return null;
            }
            
            return {
                id: payload.userId,
                email: payload.sub,
                nickname: payload.nickname,
                isAdmin: payload.isAdmin || false
            };
        } catch (error) {
            console.error('토큰 파싱 오류:', error);
            this.logout();
            return null;
        }
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            alert('로그인이 필요합니다');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    requireAdminAuth() {
        if (!this.requireAuth()) {
            return false;
        }
        
        const user = this.getCurrentUser();
        if (!user.isAdmin) {
            alert('관리자 권한이 필요합니다');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    logout() {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    },

    updateHeaderUI() {
        updateHeaderUI();
    }
};