let editPostId = null;

function initEditPostPage() {
    if (!Auth.requireAuth()) {
        return;
    }
    
    const urlParams = getURLParams();
    editPostId = urlParams.id;
    
    if (!editPostId) {
        showError('게시글을 찾을 수 없습니다.');
        return;
    }
    
    loadPostForEdit();
    setupEditPostForm();
}

function setupEditPostForm() {
    const form = document.getElementById('post-form');
    if (!form) return;
    
    form.addEventListener('submit', handleUpdatePost);
    
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = `post-detail.html?id=${editPostId}`;
        });
    }
    
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

async function loadPostForEdit() {
    const loading = document.getElementById('loading');
    const errorBanner = document.getElementById('error-banner');
    const pageHeader = document.getElementById('page-header');
    const formContainer = document.getElementById('post-form-container');
    
    try {
        showElement(loading);
        hideElement(errorBanner);
        
        const post = await PostAPI.getPost(editPostId);
        
        if (!post.isAuthor) {
            throw new Error('게시글을 수정할 권한이 없습니다.');
        }
        
        document.getElementById('title').value = post.title;
        document.getElementById('content').value = post.content;
        
        showElement(pageHeader);
        showElement(formContainer);
        
    } catch (error) {
        console.error('Error loading post for edit:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        
        showElement(errorBanner);
        
    } finally {
        hideElement(loading);
    }
}

async function handleUpdatePost(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const errorBanner = document.getElementById('form-error-banner');
    const errorMessage = document.getElementById('form-error-message');
    
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
        
        await PostAPI.updatePost(editPostId, formData);
        
        showNotification(MESSAGES.POST_UPDATE_SUCCESS, 'success');
        
        setTimeout(() => {
            window.location.href = `post-detail.html?id=${editPostId}`;
        }, 1000);
        
    } catch (error) {
        console.error('Update post error:', error);
        
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        showElement(errorBanner);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditPostPage);
} else {
    initEditPostPage();
}
