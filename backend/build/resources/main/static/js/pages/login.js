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
        
        await AuthAPI.login(formData);
        
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
    initLoginPage();
}