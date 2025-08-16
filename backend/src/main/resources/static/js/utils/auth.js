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
        this.updateHeaderUI();
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        this.updateHeaderUI();
        window.location.href = 'index.html';
    },

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    updateHeaderUI() {
        const user = this.getUser();
        if (typeof updateHeaderForUser === 'function') {
            updateHeaderForUser(user);
        }
    }
};

console.log('Auth loaded');