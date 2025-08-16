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
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const formData = {
        email: form.email.value.trim(),
        password: form.password.value
    };

    const validation = validateLoginForm(formData.email, formData.password);
    
    if (!validation.isValid) {
        clearFormErrors(form);
        
        Object.keys(validation.errors).forEach(field => {
            const input = form[field];
            const message = validation.errors[field];
            if (input) {
                addInputError(input, message);
            }
        });
        return;
    }

    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        await AuthAPI.login(formData);
        
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || 'Login failed';
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