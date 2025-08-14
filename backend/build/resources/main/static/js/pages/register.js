function initRegisterPage() {
    console.log('initRegisterPage called');
    
    if (Auth.redirectIfAuthenticated()) {
        return;
    }
    
    setupRegisterForm();
}

function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) {
        console.error('Register form not found');
        return;
    }
    
    console.log('Setting up register form');
    form.addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
    e.preventDefault();
    console.log('handleRegister called');
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const formData = {
        email: form.email.value.trim(),
        password: form.password.value,
        confirmPassword: form.confirmPassword.value,
        department: form.department.value,
        jobPosition: form.jobRole.value
    };
    
    console.log('Form data:', formData);
    
    const errors = validateRegisterForm(formData);
    
    if (hasValidationErrors(errors)) {
        showValidationErrors(errors, form);
        return;
    }
    
    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        console.log('Calling AuthAPI.register');
        const response = await AuthAPI.register({
            email: formData.email,
            password: formData.password,
            department: formData.department,
            jobPosition: formData.jobPosition
        });
        
        console.log('Register success:', response);
        showNotification(MESSAGES.REGISTER_SUCCESS, 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
    } catch (error) {
        console.error('Register error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        showElement(errorBanner);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

console.log('Register JS loaded');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegisterPage);
} else {
    initRegisterPage();
}
