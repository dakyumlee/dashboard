let currentTab = 'posts';
let deleteModalData = null;

const POSTS_PER_PAGE = 10;
const COMMENTS_PER_PAGE = 10;

let postsCurrentPage = 1;
let postsTotalPages = 1;
let commentsCurrentPage = 1;
let commentsTotalPages = 1;

function initAdminPage() {
    if (!Auth.requireAuth()) {
        return;
    }
    
    if (!Auth.requireAdmin()) {
        return;
    }
    
    HeaderComponent.init();
    setupAdminTabs();
    setupDeleteModal();
    
    showTab('posts');
}

function setupAdminTabs() {
    const postsTab = document.getElementById('posts-tab');
    const commentsTab = document.getElementById('comments-tab');
    
    if (postsTab) {
        postsTab.addEventListener('click', () => showTab('posts'));
    }
    if (commentsTab) {
        commentsTab.addEventListener('click', () => showTab('comments'));
    }
}

function showTab(tabName) {
    currentTab = tabName;
    
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');
    
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    if (tabName === 'posts') {
        loadPosts();
    } else if (tabName === 'comments') {
        loadComments();
    }
}

async function loadPosts(page = 1) {
    const loading = document.getElementById('posts-loading');
    const error = document.getElementById('posts-error');
    const content = document.getElementById('posts-content');
    const tbody = document.getElementById('posts-tbody');
    const totalElement = document.getElementById('posts-total');
    
    try {
        showElement(loading);
        hideElement(error);
        hideElement(content);
        
        const response = await AdminAPI.getPosts(page, POSTS_PER_PAGE);
        
        if (!response.success) {
            throw new Error(response.message || '게시글을 불러오는 중 오류가 발생했습니다.');
        }
        
        const { posts, pagination } = response.data;
        
        postsCurrentPage = pagination.currentPage;
        postsTotalPages = pagination.totalPages;
        
        tbody.innerHTML = '';
        
        posts.forEach(post => {
            const row = createPostRow(post);
            tbody.appendChild(row);
        });
        
        if (totalElement) {
            totalElement.textContent = pagination.totalElements;
        }
        
        updatePostsPagination();
        
        hideElement(loading);
        showElement(content);
        
    } catch (error) {
        console.error('게시글 로딩 실패:', error);
        hideElement(loading);
        showPostsError(error.message);
    }
}

function createPostRow(post) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${post.id}</td>
        <td>
            <a href="post-detail.html?id=${post.id}" class="text-link">
                ${escapeHtml(post.title)}
            </a>
        </td>
        <td>${escapeHtml(post.authorNickname)}</td>
        <td>${formatDateTime(post.createdAt)}</td>
        <td>${post.likeCount}</td>
        <td>${post.commentCount}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="showDeletePostModal(${post.id}, '${escapeHtml(post.title)}')">
                삭제
            </button>
        </td>
    `;
    return row;
}

async function loadComments(page = 1) {
    const loading = document.getElementById('comments-loading');
    const error = document.getElementById('comments-error');
    const content = document.getElementById('comments-content');
    const tbody = document.getElementById('comments-tbody');
    const totalElement = document.getElementById('comments-total');
    
    try {
        showElement(loading);
        hideElement(error);
        hideElement(content);
        
        const response = await AdminAPI.getComments(page, COMMENTS_PER_PAGE);
        
        if (!response.success) {
            throw new Error(response.message || '댓글을 불러오는 중 오류가 발생했습니다.');
        }
        
        const { comments, pagination } = response.data;
        
        commentsCurrentPage = pagination.currentPage;
        commentsTotalPages = pagination.totalPages;
        
        tbody.innerHTML = '';
        
        comments.forEach(comment => {
            const row = createCommentRow(comment);
            tbody.appendChild(row);
        });
        
        if (totalElement) {
            totalElement.textContent = pagination.totalElements;
        }
        
        updateCommentsPagination();
        
        hideElement(loading);
        showElement(content);
        
    } catch (error) {
        console.error('댓글 로딩 실패:', error);
        hideElement(loading);
        showCommentsError(error.message);
    }
}

function createCommentRow(comment) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${comment.id}</td>
        <td>
            <div class="comment-preview">
                ${escapeHtml(comment.content.length > 50 ? comment.content.substring(0, 50) + '...' : comment.content)}
            </div>
        </td>
        <td>
            <a href="post-detail.html?id=${comment.postId}" class="text-link">
                ${escapeHtml(comment.postTitle)}
            </a>
        </td>
        <td>${escapeHtml(comment.authorNickname)}</td>
        <td>${formatDateTime(comment.createdAt)}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="showDeleteCommentModal(${comment.id})">
                삭제
            </button>
        </td>
    `;
    return row;
}

function showPostsError(message) {
    const error = document.getElementById('posts-error');
    const errorMessage = document.getElementById('posts-error-message');
    const retryBtn = document.getElementById('posts-retry-btn');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    if (retryBtn) {
        retryBtn.onclick = () => loadPosts(postsCurrentPage);
    }
    
    showElement(error);
}

function showCommentsError(message) {
    const error = document.getElementById('comments-error');
    const errorMessage = document.getElementById('comments-error-message');
    const retryBtn = document.getElementById('comments-retry-btn');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    if (retryBtn) {
        retryBtn.onclick = () => loadComments(commentsCurrentPage);
    }
    
    showElement(error);
}

function updatePostsPagination() {
    const pagination = document.getElementById('posts-pagination');
    const prevBtn = document.getElementById('posts-prev-btn');
    const nextBtn = document.getElementById('posts-next-btn');
    const pageNumbers = document.getElementById('posts-page-numbers');
    
    if (postsTotalPages <= 1) {
        hideElement(pagination);
        return;
    }
    
    showElement(pagination);
    
    if (prevBtn) {
        prevBtn.disabled = postsCurrentPage <= 1;
        prevBtn.onclick = () => {
            if (postsCurrentPage > 1) {
                loadPosts(postsCurrentPage - 1);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = postsCurrentPage >= postsTotalPages;
        nextBtn.onclick = () => {
            if (postsCurrentPage < postsTotalPages) {
                loadPosts(postsCurrentPage + 1);
            }
        };
    }
    
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        const startPage = Math.max(1, postsCurrentPage - 2);
        const endPage = Math.min(postsTotalPages, postsCurrentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === postsCurrentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => loadPosts(i);
            pageNumbers.appendChild(pageBtn);
        }
    }
}

function updateCommentsPagination() {
    const pagination = document.getElementById('comments-pagination');
    const prevBtn = document.getElementById('comments-prev-btn');
    const nextBtn = document.getElementById('comments-next-btn');
    const pageNumbers = document.getElementById('comments-page-numbers');
    
    if (commentsTotalPages <= 1) {
        hideElement(pagination);
        return;
    }
    
    showElement(pagination);
    
    if (prevBtn) {
        prevBtn.disabled = commentsCurrentPage <= 1;
        prevBtn.onclick = () => {
            if (commentsCurrentPage > 1) {
                loadComments(commentsCurrentPage - 1);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = commentsCurrentPage >= commentsTotalPages;
        nextBtn.onclick = () => {
            if (commentsCurrentPage < commentsTotalPages) {
                loadComments(commentsCurrentPage + 1);
            }
        };
    }
    
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        const startPage = Math.max(1, commentsCurrentPage - 2);
        const endPage = Math.min(commentsTotalPages, commentsCurrentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === commentsCurrentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => loadComments(i);
            pageNumbers.appendChild(pageBtn);
        }
    }
}

function setupDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('delete-cancel-btn');
    const confirmBtn = document.getElementById('delete-confirm-btn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideDeleteModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleConfirmDelete);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideDeleteModal();
            }
        });
    }
}

function showDeletePostModal(postId, title) {
    deleteModalData = {
        type: 'post',
        id: postId,
        title: title
    };
    
    const modal = document.getElementById('delete-modal');
    const modalTitle = document.getElementById('delete-modal-title');
    const modalMessage = document.getElementById('delete-modal-message');
    
    if (modalTitle) {
        modalTitle.textContent = '게시글 삭제';
    }
    
    if (modalMessage) {
        modalMessage.textContent = `"${title}" 게시글을 삭제하시겠습니까?`;
    }
    
    showElement(modal);
}

function showDeleteCommentModal(commentId) {
    deleteModalData = {
        type: 'comment',
        id: commentId
    };
    
    const modal = document.getElementById('delete-modal');
    const modalTitle = document.getElementById('delete-modal-title');
    const modalMessage = document.getElementById('delete-modal-message');
    
    if (modalTitle) {
        modalTitle.textContent = '댓글 삭제';
    }
    
    if (modalMessage) {
        modalMessage.textContent = '이 댓글을 삭제하시겠습니까?';
    }
    
    showElement(modal);
}

function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    hideElement(modal);
    deleteModalData = null;
}

async function handleConfirmDelete() {
    if (!deleteModalData) return;
    
    const confirmBtn = document.getElementById('delete-confirm-btn');
    const originalText = confirmBtn.textContent;
    
    try {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '삭제 중...';
        
        let response;
        
        if (deleteModalData.type === 'post') {
            response = await AdminAPI.deletePost(deleteModalData.id);
        } else if (deleteModalData.type === 'comment') {
            response = await AdminAPI.deleteComment(deleteModalData.id);
        }
        
        if (!response.success) {
            throw new Error(response.message || '삭제 중 오류가 발생했습니다.');
        }
        
        hideDeleteModal();
        
        if (currentTab === 'posts') {
            loadPosts(postsCurrentPage);
        } else if (currentTab === 'comments') {
            loadComments(commentsCurrentPage);
        }
        
        showToast(`${deleteModalData.type === 'post' ? '게시글' : '댓글'}이 삭제되었습니다.`, 'success');
        
    } catch (error) {
        console.error('삭제 실패:', error);
        showToast(error.message, 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
    initAdminPage();
}