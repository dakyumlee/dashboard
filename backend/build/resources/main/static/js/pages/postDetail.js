let postId = null;
let currentCommentsPage = 1;

function initPostDetailPage() {
    const urlParams = getURLParams();
    postId = urlParams.id;
    
    if (!postId) {
        showError('게시글을 찾을 수 없습니다.');
        return;
    }
    
    loadPost();
    setupEventListeners();
}

function setupEventListeners() {
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => loadPost());
    }
    
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeletePost);
    }
    
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', handleToggleLike);
    }
    
    const commentForm = document.getElementById('comment-create-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCreateComment);
    }
}

async function loadPost() {
    const loading = document.getElementById('loading');
    const errorBanner = document.getElementById('error-banner');
    const postDetail = document.getElementById('post-detail');
    const commentsSection = document.getElementById('comments-section');
    
    try {
        showElement(loading);
        hideElement(errorBanner);
        
        const response = await PostAPI.getPost(postId);
        
        renderPostDetail(response);
        showElement(postDetail);
        showElement(commentsSection);
        
        if (Auth.isAuthenticated()) {
            const commentForm = document.getElementById('comment-form');
            showElement(commentForm);
        }
        
        loadComments();
        
    } catch (error) {
        console.error('Error loading post:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        
        showElement(errorBanner);
        
    } finally {
        hideElement(loading);
    }
}

function renderPostDetail(post) {
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').textContent = post.content;
    document.getElementById('post-author').textContent = post.authorNickname;
    document.getElementById('post-date').textContent = formatDateTime(post.createdAt);
    
    const likeBtn = document.getElementById('like-btn');
    const likeIcon = document.getElementById('like-icon');
    const likeCount = document.getElementById('like-count');
    
    if (likeBtn && likeIcon && likeCount) {
        likeBtn.className = post.isLiked ? 'like-btn liked' : 'like-btn';
        likeIcon.textContent = post.isLiked ? '❤️' : '🤍';
        likeCount.textContent = post.likeCount;
    }
    
    const ownerActions = document.getElementById('post-owner-actions');
    const editBtn = document.getElementById('edit-btn');
    
    if (post.isAuthor && ownerActions && editBtn) {
        editBtn.href = `edit-post.html?id=${post.id}`;
        showElement(ownerActions);
    }
}

async function loadComments() {
    try {
        const response = await CommentAPI.getComments(postId, currentCommentsPage);
        
        const commentCount = document.getElementById('comment-count');
        if (commentCount) {
            commentCount.textContent = response.totalElements || 0;
        }
        
        renderComments(response.comments || []);
        
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function renderComments(comments) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentItem = createCommentItem(comment);
        commentsList.appendChild(commentItem);
    });
}

function createCommentItem(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    
    div.innerHTML = `
        <div class="comment-meta">
            <span class="comment-author">${sanitizeHTML(comment.authorNickname)}</span>
            <span class="comment-date">${formatDateTime(comment.createdAt)}</span>
        </div>
        <div class="comment-content">${sanitizeHTML(comment.content)}</div>
        ${comment.isAuthor ? `
            <div class="comment-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">삭제</button>
            </div>
        ` : ''}
    `;
    
    return div;
}

async function handleToggleLike() {
    if (!Auth.requireAuth()) return;
    
    try {
        const response = await PostAPI.toggleLike(postId);
        
        const likeBtn = document.getElementById('like-btn');
        const likeIcon = document.getElementById('like-icon');
        const likeCount = document.getElementById('like-count');
        
        if (likeBtn && likeIcon && likeCount) {
            likeBtn.className = response.isLiked ? 'like-btn liked' : 'like-btn';
            likeIcon.textContent = response.isLiked ? '❤️' : '🤍';
            likeCount.textContent = response.likeCount;
        }
        
    } catch (error) {
        console.error('Error toggling like:', error);
        Auth.handleAuthError(error);
    }
}

async function handleCreateComment(e) {
    e.preventDefault();
    
    if (!Auth.requireAuth()) return;
    
    const form = e.target;
    const submitBtn = document.getElementById('comment-submit-btn');
    const contentTextarea = document.getElementById('comment-content');
    
    const content = contentTextarea.value.trim();
    
    if (!content) {
        addInputError(contentTextarea, '댓글 내용을 입력해주세요');
        return;
    }
    
    try {
        setLoading(submitBtn, true);
        
        await CommentAPI.createComment(postId, { content });
        
        showNotification(MESSAGES.COMMENT_CREATE_SUCCESS, 'success');
        
        form.reset();
        removeInputError(contentTextarea);
        
        loadComments();
        
    } catch (error) {
        console.error('Error creating comment:', error);
        Auth.handleAuthError(error);
        
    } finally {
        setLoading(submitBtn, false);
    }
}

async function handleDeletePost() {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await PostAPI.deletePost(postId);
        
        showNotification(MESSAGES.POST_DELETE_SUCCESS, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Error deleting post:', error);
        Auth.handleAuthError(error);
    }
}

async function deleteComment(commentId) {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await CommentAPI.deleteComment(commentId);
        
        showNotification(MESSAGES.COMMENT_DELETE_SUCCESS, 'success');
        
        loadComments();
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        Auth.handleAuthError(error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostDetailPage);
} else {
    initPostDetailPage();
}
