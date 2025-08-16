let postId = null;
let currentCommentsPage = 1;

function initPostDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    postId = urlParams.get('id');
    
    if (!postId) {
        alert('게시글을 찾을 수 없습니다.');
        window.location.href = 'index.html';
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
        if (loading) loading.style.display = 'block';
        if (errorBanner) errorBanner.style.display = 'none';
        
        const response = await APIClient.get(`/posts/${postId}`);
        
        renderPostDetail(response);
        if (postDetail) postDetail.style.display = 'block';
        if (commentsSection) commentsSection.style.display = 'block';
        
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        if (user.email) {
            const commentForm = document.getElementById('comment-form');
            if (commentForm) commentForm.style.display = 'block';
        }
        
        loadComments();
        
    } catch (error) {
        console.error('Error loading post:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || '게시글을 불러오는 중 오류가 발생했습니다.';
        }
        
        if (errorBanner) errorBanner.style.display = 'block';
        
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function renderPostDetail(post) {
    const titleEl = document.getElementById('post-title');
    const contentEl = document.getElementById('post-content');
    const authorEl = document.getElementById('post-author');
    const dateEl = document.getElementById('post-date');
    const likeCountEl = document.getElementById('like-count');
    
    if (titleEl) titleEl.textContent = post.title || '제목 없음';
    if (contentEl) contentEl.textContent = post.content || '내용 없음';
    if (authorEl) authorEl.textContent = post.authorNickname || '익명';
    if (dateEl) dateEl.textContent = new Date(post.createdAt).toLocaleString();
    if (likeCountEl) likeCountEl.textContent = post.likeCount || 0;
}

async function loadComments() {
    try {
        const response = await APIClient.get(`/posts/${postId}/comments`);
        
        const commentCountEl = document.getElementById('comment-count');
        if (commentCountEl) {
            commentCountEl.textContent = response.length || 0;
        }
        
        renderComments(response || []);
        
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function renderComments(comments) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        commentItem.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">${comment.authorNickname || '익명'}</span>
                <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div class="comment-content">${comment.content || ''}</div>
            ${comment.isAuthor ? `
                <div class="comment-actions">
                    <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">삭제</button>
                </div>
            ` : ''}
        `;
        
        commentsList.appendChild(commentItem);
    });
}

async function handleCreateComment(e) {
    e.preventDefault();
    
    const form = e.target;
    const contentInput = form.querySelector('[name="content"]');
    const submitBtn = document.getElementById('comment-submit-btn');
    
    if (!contentInput.value.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '작성 중...';
        }
        
        await APIClient.post(`/posts/${postId}/comments`, {
            content: contentInput.value.trim()
        });
        
        contentInput.value = '';
        alert('댓글이 작성되었습니다!');
        loadComments();
        
    } catch (error) {
        console.error('Error creating comment:', error);
        alert(error.message || '댓글 작성 중 오류가 발생했습니다.');
        
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '댓글 작성';
        }
    }
}

async function handleToggleLike() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    if (!user.email) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    try {
        await APIClient.post(`/posts/${postId}/like`);
        loadPost();
        
    } catch (error) {
        console.error('Error toggling like:', error);
        alert(error.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
}

async function deleteComment(commentId) {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await APIClient.delete(`/comments/${commentId}`);
        alert('댓글이 삭제되었습니다.');
        loadComments();
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert(error.message || '댓글 삭제 중 오류가 발생했습니다.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostDetailPage);
} else {
    initPostDetailPage();
}