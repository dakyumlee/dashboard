async function initCreatePostPage() {
    const isAuth = await Auth.requireAuth();
    if (isAuth) {
        setupCreatePostForm();
    }
}

function setupCreatePostForm() {
    const form = document.getElementById('post-form');
    if (!form) return;
    
    form.addEventListener('submit', handleCreatePost);
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateFormField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateFormField(input);
            }
        });
    });
}

async function handleCreatePost(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    const formData = {
        title: form.title.value.trim(),
        content: form.content.value.trim()
    };
    
    const errors = validatePostForm(formData);
    
    if (hasValidationErrors(errors)) {
        showValidationErrors(errors, form);
        return;
    }
    
    try {
        setLoading(submitBtn, true);
        hideElement(errorBanner);
        
        await PostAPI.createPost(formData);
        
        showNotification(MESSAGES.POST_CREATED, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Create post error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        showElement(errorBanner);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

function validatePostForm(formData) {
    const errors = {};
    
    if (!formData.title || formData.title.length < VALIDATION.MIN_TITLE_LENGTH) {
        errors.title = `제목은 최소 ${VALIDATION.MIN_TITLE_LENGTH}자 이상이어야 합니다`;
    }
    
    if (formData.title && formData.title.length > VALIDATION.MAX_TITLE_LENGTH) {
        errors.title = `제목은 최대 ${VALIDATION.MAX_TITLE_LENGTH}자까지 입력 가능합니다`;
    }
    
    if (!formData.content || formData.content.length < VALIDATION.MIN_CONTENT_LENGTH) {
        errors.content = `내용은 최소 ${VALIDATION.MIN_CONTENT_LENGTH}자 이상이어야 합니다`;
    }
    
    if (formData.content && formData.content.length > VALIDATION.MAX_CONTENT_LENGTH) {
        errors.content = `내용은 최대 ${VALIDATION.MAX_CONTENT_LENGTH}자까지 입력 가능합니다`;
    }
    
    return errors;
}

function validateFormField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let error = null;
    
    if (fieldName === 'title') {
        if (!value || value.length < VALIDATION.MIN_TITLE_LENGTH) {
            error = `제목은 최소 ${VALIDATION.MIN_TITLE_LENGTH}자 이상이어야 합니다`;
        } else if (value.length > VALIDATION.MAX_TITLE_LENGTH) {
            error = `제목은 최대 ${VALIDATION.MAX_TITLE_LENGTH}자까지 입력 가능합니다`;
        }
    } else if (fieldName === 'content') {
        if (!value || value.length < VALIDATION.MIN_CONTENT_LENGTH) {
            error = `내용은 최소 ${VALIDATION.MIN_CONTENT_LENGTH}자 이상이어야 합니다`;
        } else if (value.length > VALIDATION.MAX_CONTENT_LENGTH) {
            error = `내용은 최대 ${VALIDATION.MAX_CONTENT_LENGTH}자까지 입력 가능합니다`;
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
    document.addEventListener('DOMContentLoaded', initCreatePostPage);
} else {
    initCreatePostPage();
}