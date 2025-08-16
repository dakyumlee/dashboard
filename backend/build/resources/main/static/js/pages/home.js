let currentPage = 1;
let totalPages = 1;

function initHomePage() {
    loadPosts(currentPage);
    setupEventListeners();
}

function setupEventListeners() {
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => loadPosts(currentPage));
    }
}

async function loadPosts(page = 1) {
    const loading = document.getElementById('loading');
    const errorBanner = document.getElementById('error-banner');
    const postList = document.getElementById('post-list');
    const emptyState = document.getElementById('empty-state');
    
    try {
        if (loading) loading.style.display = 'block';
        if (errorBanner) errorBanner.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        
        const response = await APIClient.get('/posts', {page: page, size: 10});
        
        if (response && response.length > 0) {
            renderSimplePostList(response, postList);
        } else {
            if (emptyState) emptyState.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading posts:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || '게시글을 불러오는 중 오류가 발생했습니다.';
        }
        
        if (errorBanner) errorBanner.style.display = 'block';
        
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function renderSimplePostList(posts, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        const content = post.content && post.content.trim() ? 
            post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '') : 
            '';
            
        postCard.innerHTML = `
            <h3 class="post-title">${post.title || '제목 없음'}</h3>
            <p class="post-content">${content}</p>
            <div class="post-meta">
                <span class="post-author">${post.authorNickname || '익명'}</span>
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                <span class="post-stats">
                    <span class="post-likes">❤️ ${post.likeCount || 0}</span>
                    <span class="post-comments">💬 ${post.commentCount || 0}</span>
                </span>
            </div>
        `;
        
        postCard.addEventListener('click', () => {
            window.location.href = `post-detail.html?id=${post.id}`;
        });
        
        container.appendChild(postCard);
    });
    
    container.style.display = 'block';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}