function initRegisterPage() {
    if (Auth.redirectIfAuthenticated()) {
        return;
    }
    
    setupRegisterForm();
    setupNicknamePreview();
}

function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    form.addEventListener('submit', handleRegister);
    
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateFormField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateFormField(input);
            }
        });
    });
}

function setupNicknamePreview() {
    const departmentSelect = document.getElementById('department');
    const jobRoleSelect = document.getElementById('jobRole');
    const nicknamePreview = document.getElementById('nickname-preview');
    const nicknameDisplay = document.getElementById('nickname-display');
    
    if (!departmentSelect || !jobRoleSelect) return;
    
    function updateNicknamePreview() {
        const department = departmentSelect.value;
        const jobRole = jobRoleSelect.value;
        
        if (department && jobRole) {
            const previewNickname = `${department}-000`;
            nicknameDisplay.textContent = previewNickname;
            showElement(nicknamePreview);
        } else {
            hideElement(nicknamePreview);
        }
    }
    
    departmentSelect.addEventListener('change', updateNicknamePreview);
    jobRoleSelect.addEventListener('change', updateNicknamePreview);
}

async function handleRegister(e) {
    e.preventDefault();
    
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
    
    const errors = validateRegisterForm(formData);
    
    if (hasValidationErrors(errors)) {
        showValidationErrors(errors, form);
        return;
    }
    
    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        await AuthAPI.register({
            email: formData.email,
            password: formData.password,
            department: formData.department,
            jobPosition: formData.jobPosition
        });
        
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegisterPage);
} else {
    initRegisterPage();
}