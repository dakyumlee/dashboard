function initLoginPage() {
    Auth.redirectIfAuthenticated().then(redirected => {
        if (!redirected) {
            setupLoginForm();
        }
    });
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', handleLogin);
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateLoginField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateLoginField(input);
            }
        });
    });
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
    
    const errors = validateLoginForm(formData);
    
    if (hasValidationErrors(errors)) {
        showValidationErrors(errors, form);
        return;
    }
    
    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        const response = await AuthAPI.login(formData);
        
        Auth.setCurrentUser({
            email: response.email,
            nickname: response.nickname,
            isAdmin: response.isAdmin
        });
        
        showNotification(MESSAGES.LOGIN_SUCCESS, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        showElement(errorBanner);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

function validateLoginForm(formData) {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요';
    }
    
    return errors;
}

function validateLoginField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let error = null;
    
    if (fieldName === 'email') {
        error = validateEmail(value);
    } else if (fieldName === 'password') {
        if (!value) {
            error = '비밀번호를 입력해주세요';
        }
    }
    
    if (error) {
        addInputError(input, error);
    } else {
        removeInputError(input);
    }
    
    return !error;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
    initLoginPage();
}