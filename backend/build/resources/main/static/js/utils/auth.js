const Auth = {
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    setToken(token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },

    setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.isAdmin === true;
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    requireAdmin() {
        const user = this.getUser();
        
        if (!user) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return false;
        }
        
        if (!user.isAdmin) {
            alert('관리자 권한이 필요합니다.');
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    },

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = 'index.html';
    },

    updateHeaderUI() {
        const user = this.getUser();
        
        if (typeof updateHeaderForUser === 'function') {
            updateHeaderForUser(user);
        }
    }
};

console.log('Auth loaded');