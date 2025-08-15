const Auth = {
    currentUser: null,

    async getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }
        
        try {
            const response = await AuthAPI.getCurrentUser();
            this.currentUser = response;
            return response;
        } catch (error) {
            this.currentUser = null;
            return null;
        }
    },

    setCurrentUser(user) {
        this.currentUser = user;
    },

    clearCurrentUser() {
        this.currentUser = null;
    },

    async isAuthenticated() {
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch (error) {
            return false;
        }
    },

    async requireAuth() {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    async redirectIfAuthenticated() {
        const isAuth = await this.isAuthenticated();
        if (isAuth) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    async updateHeaderUI() {
        try {
            const user = await this.getCurrentUser();
            updateHeaderForUser(user);
        } catch (error) {
            updateHeaderForUser(null);
        }
    },

    async logout() {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearCurrentUser();
            updateHeaderForUser(null);
            window.location.href = 'login.html';
        }
    }
};