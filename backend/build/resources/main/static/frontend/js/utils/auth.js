const Auth = {
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    setToken(token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    removeToken() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },

    setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    removeUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.isAdmin;
    },

    logout() {
        this.removeToken();
        this.removeUser();
        showNotification(MESSAGES.LOGOUT_SUCCESS, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            showNotification(MESSAGES.UNAUTHORIZED, 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
        return true;
    },

    requireAdmin() {
        if (!this.requireAuth()) return false;
        
        if (!this.isAdmin()) {
            showNotification(MESSAGES.FORBIDDEN, 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
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

    updateHeaderUI() {
        const navGuest = document.getElementById('nav-guest');
        const navUser = document.getElementById('nav-user');
        const userNickname = document.getElementById('user-nickname');
        const adminLink = document.getElementById('admin-link');

        if (!navGuest || !navUser) return;

        if (this.isAuthenticated()) {
            const user = this.getUser();
            
            hideElement(navGuest);
            showElement(navUser);
            
            if (userNickname && user) {
                userNickname.textContent = user.nickname;
            }
            
            if (adminLink) {
                toggleElement(adminLink, this.isAdmin());
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        } else {
            showElement(navGuest);
            hideElement(navUser);
        }
    },

    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    handleAuthError(error) {
        if (error.status === 401) {
            this.logout();
            return;
        }
        
        let message = MESSAGES.SERVER_ERROR;
        
        switch (error.status) {
            case 403:
                message = MESSAGES.FORBIDDEN;
                break;
            case 404:
                message = MESSAGES.NOT_FOUND;
                break;
            case 500:
                message = MESSAGES.SERVER_ERROR;
                break;
            default:
                if (error.message) {
                    message = error.message;
                }
        }
        
        showNotification(message, 'error');
    }
};

function initAuth() {
    Auth.updateHeaderUI();
}