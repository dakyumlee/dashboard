const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

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
        if (!this.requireAuth()) {
            return false;
        }
        if (!this.isAdmin()) {
            alert('관리자 권한이 필요합니다.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = 'index.html';
    },

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    updateHeaderUI() {
        if (typeof updateHeaderForUser === 'function') {
            const user = this.getUser();
            updateHeaderForUser(user);
        }
    }
};

console.log('Auth loaded');