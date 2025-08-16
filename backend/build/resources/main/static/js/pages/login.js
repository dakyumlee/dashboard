async function loginUser(loginData) {
    try {
        const response = await AuthAPI.login(loginData);
        
        Auth.setToken(response.token);
        Auth.setUser({
            email: response.email,
            nickname: response.nickname,
            isAdmin: response.isAdmin
        });
        
        alert('로그인이 완료되었습니다!');
        window.location.href = 'index.html';
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || '로그인 중 오류가 발생했습니다.');
        throw error;
    }
}

function showError(message) {
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    if (errorBanner && errorMessage) {
        errorMessage.textContent = message;
        errorBanner.classList.remove('hidden');
    }
}

function hideError() {
    const errorBanner = document.getElementById('error-banner');
    if (errorBanner) {
        errorBanner.classList.add('hidden');
    }
}

function initLoginPage() {
    if (Auth.redirectIfAuthenticated()) {
        return;
    }

    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideError();
            
            const formData = new FormData(this);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            console.log('Form submitted with data:', loginData);
            
            if (!loginData.email || !loginData.password) {
                showError('이메일과 비밀번호를 모두 입력해주세요.');
                return;
            }
            
            await loginUser(loginData);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page DOM loaded');
    initLoginPage();
});

console.log('Login page script loaded');