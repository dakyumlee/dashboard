function validateEmail(email) {
    return VALIDATION.EMAIL_REGEX.test(email);
}

function validatePassword(password) {
    return password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
}

function validateLoginForm(email, password) {
    const errors = {};
    
    if (!email) {
        errors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(email)) {
        errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (!password) {
        errors.password = '비밀번호를 입력해주세요.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

function validateRegisterForm(formData) {
    const errors = {};
    
    if (!formData.email) {
        errors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
        errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요.';
    } else if (!validatePassword(formData.password)) {
        errors.password = `비밀번호는 최소 ${VALIDATION.MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`;
    }
    
    if (!formData.confirmPassword) {
        errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    if (!formData.department) {
        errors.department = '부서를 선택해주세요.';
    }
    
    if (!formData.jobPosition) {
        errors.jobPosition = '직급을 선택해주세요.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

function validatePostForm(title, content) {
    const errors = {};
    
    if (!title || title.trim().length === 0) {
        errors.title = '제목을 입력해주세요.';
    } else if (title.length > 200) {
        errors.title = '제목은 200자 이하로 입력해주세요.';
    }
    
    if (!content || content.trim().length === 0) {
        errors.content = '내용을 입력해주세요.';
    } else if (content.length < 10) {
        errors.content = '내용은 최소 10자 이상 입력해주세요.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

function validateCommentForm(content) {
    const errors = {};
    
    if (!content || content.trim().length === 0) {
        errors.content = '댓글 내용을 입력해주세요.';
    } else if (content.length < 2) {
        errors.content = '댓글은 최소 2자 이상 입력해주세요.';
    } else if (content.length > 1000) {
        errors.content = '댓글은 1000자 이하로 입력해주세요.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

console.log('Validation loaded');