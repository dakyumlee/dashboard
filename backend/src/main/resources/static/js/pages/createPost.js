function initCreatePostPage() {
    if (!Auth.requireAuth()) {
        return;
    }
    
    setupCreatePostForm();
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
        
        showNotification(MESSAGES.POST_CREATE_SUCCESS, 'success');
        
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCreatePostPage);
} else {
    initCreatePostPage();
}