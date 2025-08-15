const API_BASE_URL = 'http://localhost:8080/api';

class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            await this.checkAuthStatus();
        } catch (error) {
            console.log('초기 인증 상태 확인 실패:', error);
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.isLoggedIn = true;
                this.currentUser = data.user;
                this.updateUI();
                return data.user;
            } else {
                this.isLoggedIn = false;
                this.currentUser = null;
                this.updateUI();
                return null;
            }
        } catch (error) {
            console.error('인증 상태 확인 오류:', error);
            this.isLoggedIn = false;
            this.currentUser = null;
            this.updateUI();
            return null;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.isLoggedIn = true;
                this.currentUser = data.user;
                this.updateUI();
                return { success: true, data };
            } else {
                return { success: false, message: data.message || '로그인에 실패했습니다' };
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            return { success: false, message: '네트워크 오류가 발생했습니다' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, message: data.message || '회원가입에 실패했습니다' };
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            return { success: false, message: '네트워크 오류가 발생했습니다' };
        }
    }

    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.isLoggedIn = false;
                this.currentUser = null;
                this.updateUI();
                return { success: true };
            } else {
                return { success: false, message: '로그아웃에 실패했습니다' };
            }
        } catch (error) {
            console.error('로그아웃 오류:', error);
            return { success: false, message: '네트워크 오류가 발생했습니다' };
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const registerBtn = document.getElementById('register-btn');

        if (this.isLoggedIn && this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (userInfo) {
                userInfo.textContent = `${this.currentUser.nickname} (${this.currentUser.email})`;
                userInfo.style.display = 'block';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    requireAuth() {
        if (!this.isLoggedIn) {
            alert('로그인이 필요합니다');
            window.location.href = '/';
            return false;
        }
        return true;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }
}

const auth = new Auth();

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('이메일과 비밀번호를 입력해주세요');
        return;
    }
    
    const result = await auth.login(email, password);
    
    if (result.success) {
        alert('로그인 성공!');
        window.location.href = '/';
    } else {
        alert(result.message);
    }
}

async function handleLogout() {
    const result = await auth.logout();
    
    if (result.success) {
        alert('로그아웃 되었습니다');
        window.location.href = '/';
    } else {
        alert(result.message || '로그아웃에 실패했습니다');
    }
}

window.auth = auth;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;