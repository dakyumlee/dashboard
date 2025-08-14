const Auth = {
    getUser() {
        const userData = sessionStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },

    setUser(user) {
        if (user) {
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(STORAGE_KEYS.USER);
        }
    },

    isAuthenticated() {
        return !!this.getUser();
    },

    logout() {
        sessionStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = 'login.html';
    },

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    async requireAuth() {
        if (!this.isAuthenticated()) {
            try {
                await AuthAPI.getCurrentUser();
                return true;
            } catch (error) {
                alert('로그인이 필요합니다.');
                window.location.href = 'login.html';
                return false;
            }
        }
        return true;
    },

    updateHeaderUI() {
        const user = this.getUser();
        updateHeaderForUser(user);
    },

    handleAuthError(error) {
        if (error.status === 401 || error.status === 403) {
            this.logout();
        }
    }
};

console.log('Auth loaded');