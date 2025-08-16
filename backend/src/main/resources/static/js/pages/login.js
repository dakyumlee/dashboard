function initLoginPage() {
    if (Auth && Auth.redirectIfAuthenticated && Auth.redirectIfAuthenticated()) {
        return;
    }

    setupLoginForm();
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) {
        console.error('Login form not found');
        return;
    }

    form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const emailInput = form.querySelector('[name="email"]');
    const passwordInput = form.querySelector('[name="password"]');
    
    if (!emailInput || !passwordInput) {
        console.error('Email or password input not found');
        return;
    }
    
    const formData = {
        email: emailInput.value ? emailInput.value.trim() : '',
        password: passwordInput.value || ''
    };

    if (!formData.email) {
        alert('이메일을 입력해주세요');
        return;
    }
    
    if (!formData.password) {
        alert('비밀번호를 입력해주세요');
        return;
    }

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '로그인 중...';
        }
        
        if (errorBanner && typeof hideElement === 'function') {
            hideElement(errorBanner);
        }
        
        if (typeof AuthAPI !== 'undefined' && AuthAPI.login) {
            await AuthAPI.login(formData);
            
            alert('로그인이 완료되었습니다!');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            console.log('Login attempt:', formData);
            alert('로그인 API가 준비되지 않았습니다. 개발자 도구를 확인해주세요.');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || '로그인 중 오류가 발생했습니다.';
        }
        if (errorBanner && typeof showElement === 'function') {
            showElement(errorBanner);
        } else {
            alert(error.message || '로그인 중 오류가 발생했습니다.');
        }
        
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '로그인';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
    initLoginPage();
}