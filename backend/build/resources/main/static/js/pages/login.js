function initLoginPage() {
    if (Auth.redirectIfAuthenticated()) {
        return;
    }
    
    setupLoginForm();
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');
    
    if (!email || !password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
    }
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '로그인 중...';
        }
        
        await AuthAPI.login({ email, password });
        
        alert('로그인되었습니다!');
        window.location.href = 'index.html';
        
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '로그인';
        }
    }
}

console.log('Login page loaded');