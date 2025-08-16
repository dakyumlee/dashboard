function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

function toggleElement(element, show) {
    if (element) {
        if (show) {
            showElement(element);
        } else {
            hideElement(element);
        }
    }
}

function setLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.textContent = '처리중...';
    } else {
        button.disabled = false;
        button.textContent = button.getAttribute('data-original-text') || '확인';
    }
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function validateFormField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    input.classList.remove('error');
    
    if (!value) {
        input.classList.add('error');
        return false;
    }
    
    if (type === 'email' && !VALIDATION.EMAIL_REGEX.test(value)) {
        input.classList.add('error');
        return false;
    }
    
    if (name === 'password' && value.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        input.classList.add('error');
        return false;
    }
    
    return true;
}

function validateLoginForm(formData) {
    const errors = {};
    
    if (!formData.email || !VALIDATION.EMAIL_REGEX.test(formData.email)) {
        errors.email = '유효한 이메일을 입력해주세요';
    }
    
    if (!formData.password || formData.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        errors.password = `비밀번호는 ${VALIDATION.MIN_PASSWORD_LENGTH}자 이상이어야 합니다`;
    }
    
    return errors;
}

function hasValidationErrors(errors) {
    return Object.keys(errors).length > 0;
}

function showValidationErrors(errors, form) {
    Object.keys(errors).forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('error');
        }
    });
}

console.log('Helpers loaded');