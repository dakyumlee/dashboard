function initLoginPage() {
    console.log('Initializing login page...');
    
    if (Auth.redirectIfAuthenticated()) {
        return;
    }

    setupLoginForm();
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!form) {
        console.error('Login form not found');
        return;
    }

    console.log('Setting up login form...');
    form.addEventListener('submit', handleLogin);
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateFormField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateFormField(input);
            }
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const formData = {
        email: form.email.value.trim(),
        password: form.password.value
    };

    console.log('Form data:', { email: formData.email, password: '***' });

    const errors = validateLoginForm(formData);
    
    if (hasValidationErrors(errors)) {
        console.log('Validation errors:', errors);
        showValidationErrors(errors, form);
        return;
    }

    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        console.log('Attempting login...');
        await AuthAPI.login(formData);
        
        console.log('Login successful!');
        showNotification(MESSAGES.LOGIN_SUCCESS || '로그인 성공!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR || '서버 오류가 발생했습니다';
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

console.log('Login script loaded');