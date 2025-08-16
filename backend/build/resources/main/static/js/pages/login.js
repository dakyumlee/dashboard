function initLoginPage() {
    if (Auth.redirectIfAuthenticated()) {
        return;
    }

    setupLoginForm();
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!form) return;

    form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const formData = {
        email: form.email.value.trim(),
        password: form.password.value
    };

    if (!formData.email || !formData.password) {
        if (errorMessage) {
            errorMessage.textContent = '이메일과 비밀번호를 입력해주세요.';
        }
        showElement(errorBanner);
        return;
    }

    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        await AuthAPI.login(formData);
        
        showNotification('로그인이 완료되었습니다!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        showElement(errorBanner);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
    initLoginPage();
}