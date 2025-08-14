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
    if (!VALIDATION.PASSWORD_REGEX.test(password)) {
        return '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다';
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

function validateDepartment(department) {
    if (!department) {
        return '부서를 선택해주세요';
    }
    if (!DEPARTMENTS.includes(department)) {
        return '올바른 부서를 선택해주세요';
    }
    return null;
}

function validateJobRole(jobRole) {
    if (!jobRole) {
        return '직급을 선택해주세요';
    }
    if (!JOB_ROLES.includes(jobRole)) {
        return '올바른 직급을 선택해주세요';
    }
    return null;
}

function validateTitle(title) {
    if (!title.trim()) {
        return '제목을 입력해주세요';
    }
    if (title.trim().length < VALIDATION.MIN_TITLE_LENGTH) {
        return `제목은 최소 ${VALIDATION.MIN_TITLE_LENGTH}자 이상이어야 합니다`;
    }
    if (title.length > VALIDATION.MAX_TITLE_LENGTH) {
        return `제목은 최대 ${VALIDATION.MAX_TITLE_LENGTH}자까지 입력 가능합니다`;
    }
    return null;
}

function validateContent(content) {
    if (!content.trim()) {
        return '내용을 입력해주세요';
    }
    if (content.trim().length < VALIDATION.MIN_CONTENT_LENGTH) {
        return `내용은 최소 ${VALIDATION.MIN_CONTENT_LENGTH}자 이상이어야 합니다`;
    }
    if (content.length > VALIDATION.MAX_CONTENT_LENGTH) {
        return `내용은 최대 ${VALIDATION.MAX_CONTENT_LENGTH}자까지 입력 가능합니다`;
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

function validateRegisterForm(formData) {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    const departmentError = validateDepartment(formData.department);
    if (departmentError) errors.department = departmentError;
    
    const jobRoleError = validateJobRole(formData.jobRole);
    if (jobRoleError) errors.jobRole = jobRoleError;
    
    return errors;
}

function validatePostForm(formData) {
    const errors = {};
    
    const titleError = validateTitle(formData.title);
    if (titleError) errors.title = titleError;
    
    const contentError = validateContent(formData.content);
    if (contentError) errors.content = contentError;
    
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
    
    const firstError = Object.keys(errors)[0];
    if (firstError) {
        const firstInput = form.querySelector(`[name="${firstError}"]`);
        if (firstInput) {
            firstInput.focus();
        }
    }
}

function hasValidationErrors(errors) {
    return Object.keys(errors).length > 0;
}

function validateFormField(input) {
    const name = input.name;
    const value = input.value;
    
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
            error = validateConfirmPassword(passwordInput ? passwordInput.value : '', value);
            break;
        case 'department':
            error = validateDepartment(value);
            break;
        case 'jobRole':
            error = validateJobRole(value);
            break;
        case 'title':
            error = validateTitle(value);
            break;
        case 'content':
            error = validateContent(value);
            break;
    }
    
    if (error) {
        addInputError(input, error);
        return false;
    } else {
        removeInputError(input);
        return true;
    }
}