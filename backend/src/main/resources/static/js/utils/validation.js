function validateEmail(email) {
    if (!email || !email.trim()) {
        return '이메일을 입력해주세요';
    }
    if (!VALIDATION.EMAIL_REGEX.test(email.trim())) {
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

function validateLoginForm(formData) {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    return errors;
}

function validateCompany(company) {
    if (!company || !company.trim()) {
        return '회사명을 입력해주세요';
    }
    if (company.trim().length < 2) {
        return '회사명은 최소 2자 이상이어야 합니다';
    }
    return null;
}

function validateFormField(input) {
    if (!input) return null;
    
    const name = input.name;
    const value = input.value ? input.value.trim() : '';
    let error = null;

    switch (name) {
        case 'email':
            error = validateEmail(value);
            break;
        case 'password':
            error = validatePassword(value);
            break;
        case 'confirmPassword':
            const passwordInput = input.form.querySelector('[name="password"]');
            const passwordValue = passwordInput ? passwordInput.value : '';
            error = validateConfirmPassword(passwordValue, value);
            break;
        case 'company':
            error = validateCompany(value);
            break;
        case 'department':
            if (!value) error = '부서를 선택해주세요';
            break;
        case 'jobRole':
            if (!value) error = '직급을 선택해주세요';
            break;
    }

    if (error) {
        addInputError(input, error);
    } else {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    return error;
}

function validateRegisterForm(formData) {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    const companyError = validateCompany(formData.company);
    if (companyError) errors.company = companyError;
    
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