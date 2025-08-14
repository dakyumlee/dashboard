function validateEmail(email) {
    if (!email.trim()) {
        return '이메일을 입력해주세요';
    }
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
        return '올바른 이메일 형식을 입력해주세요';
    }
    return null;
}

function validatePassword(password) {
    if (!password) {
        return '비밀번호를 입력해주세요';
    }
    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        return `비밀번호는 최소 ${VALIDATION.MIN_PASSWORD_LENGTH}자 이상이어야 합니다`;
    }
    return null;
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
        return '비밀번호 확인을 입력해주세요';
    }
    if (password !== confirmPassword) {
        return '비밀번호가 일치하지 않습니다';
    }
    return null;
}

function validateRegisterForm(formData) {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    if (!formData.department) errors.department = '부서를 선택해주세요';
    if (!formData.jobPosition) errors.jobRole = '직급을 선택해주세요';
    
    return errors;
}

function showValidationErrors(errors, form) {
    clearFormErrors(form);
    
    Object.entries(errors).forEach(([field, message]) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            addInputError(input, message);
        }
    });
}

function hasValidationErrors(errors) {
    return Object.keys(errors).length > 0;
}

console.log('Validation loaded');
