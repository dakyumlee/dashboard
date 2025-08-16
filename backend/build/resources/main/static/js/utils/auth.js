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

    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    redirectIfNotAuthenticated() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return true;
        }
        return false;
    },

    updateHeaderUI() {
        const user = this.getUser();
        updateHeaderForUser(user);
    },

    isAdmin() {
        const user = this.getUser();
        return user ? user.isAdmin : false;
    }
};

console.log('Auth loaded');