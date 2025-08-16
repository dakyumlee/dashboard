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
            errorMessage.textContent = error.message || 'MESSAGES.SERVER_ERROR';
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
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            commentsSection.classList.remove('hidden');
            commentsSection.style.display = 'block';
        }
        
        const response = await fetchComments(postId, currentCommentsPage);
        
        const commentCount = document.getElementById('comment-count');
        if (commentCount) {
            commentCount.textContent = response.totalElements || 0;
        }
        
        renderComments(response.comments || []);
        
    } catch (error) {
        console.error('Error loading comments:', error);
        
        const commentsList = document.getElementById('comments-list');
        if (commentsList) {
            commentsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">댓글을 불러올 수 없습니다.</div>';
        }
    }
}

async function fetchComments(postId, page = 1, size = 10) {
    const url = new URL(`http://localhost:8080/api/posts/${postId}/comments`, window.location.origin);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
    }
    
    return await response.json();
}

function renderComments(comments) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) {
        console.error('comments-list 요소를 찾을 수 없습니다');
        return;
    }
    
    commentsList.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        commentsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">첫 번째 댓글을 작성해보세요!</div>';
        return;
    }
    
    comments.forEach(comment => {
        const commentItem = createCommentItem(comment);
        commentsList.appendChild(commentItem);
    });
}

function createCommentItem(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.style.cssText = 'border-bottom: 1px solid #f1f3f5; padding: 16px 0;';
    
    const authorNickname = comment.authorNickname || '익명';
    const content = comment.content || '';
    const createdAt = comment.createdAt || new Date().toISOString();
    const isAuthor = comment.isAuthor || false;
    const commentId = comment.id || 0;
    
    div.innerHTML = `
        <div class="comment-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="comment-author" style="font-weight: 600; color: #333; font-size: 14px;">${sanitizeHTML(authorNickname)}</span>
            <span class="comment-date" style="color: #888; font-size: 12px;">${formatDateTime(createdAt)}</span>
        </div>
        <div class="comment-content" style="color: #333; line-height: 1.6; font-size: 14px; margin-bottom: 8px;">${sanitizeHTML(content)}</div>
        ${isAuthor ? `
            <div class="comment-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteComment(${commentId})" style="padding: 4px 8px; font-size: 12px;">삭제</button>
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
        
        const response = await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            throw new Error('댓글 작성에 실패했습니다.');
        }
        
        showNotification('댓글이 작성되었습니다!', 'success');
        
        form.reset();
        removeInputError(contentTextarea);
        
        loadComments();
        
    } catch (error) {
        console.error('Error creating comment:', error);
        showNotification(error.message, 'error');
        
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
        
        showNotification('게시글이 삭제되었습니다!', 'success');
        
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
        const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('댓글 삭제에 실패했습니다.');
        }
        
        showNotification('댓글이 삭제되었습니다!', 'success');
        
        loadComments();
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        showNotification(error.message, 'error');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostDetailPage);
} else {
    initPostDetailPage();
}