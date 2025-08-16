function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
        element.style.display = 'block';
    }
}

function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
        element.style.display = 'none';
    }
}

function renderPostList(posts, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.style.cssText = 'border: 1px solid #ddd; padding: 15px; margin: 10px 0; cursor: pointer; border-radius: 5px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        
        postCard.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${post.title}</h3>
            <div style="color: #666; font-size: 14px; display: flex; gap: 15px;">
                <span>작성자: ${post.authorNickname}</span>
                <span>작성일: ${new Date(post.createdAt).toLocaleDateString()}</span>
                <span>❤️ ${post.likeCount || 0}</span>
            </div>
        `;
        
        postCard.addEventListener('click', () => {
            window.location.href = `post-detail.html?id=${post.id}`;
        });
        
        postCard.addEventListener('mouseenter', () => {
            postCard.style.backgroundColor = '#f5f5f5';
        });
        
        postCard.addEventListener('mouseleave', () => {
            postCard.style.backgroundColor = 'white';
        });
        
        container.appendChild(postCard);
    });
    
    showElement(container);
}

let currentPage = 1;
let totalPages = 1;

function initHomePage() {
    console.log('Home page initializing...');
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
    console.log('Loading posts for page:', page);
    
    const loading = document.getElementById('loading');
    const errorBanner = document.getElementById('error-banner');
    const postList = document.getElementById('post-list');
    const pagination = document.getElementById('pagination');
    const emptyState = document.getElementById('empty-state');

    try {
        showElement(loading);
        hideElement(errorBanner);
        hideElement(pagination);
        hideElement(emptyState);

        const response = await PostAPI.getPosts(page, 10);
        console.log('API Response:', response);
        
        if (response && response.length > 0) {
            renderPostList(response, postList);
            
            currentPage = page;
            totalPages = 1;
            
            if (totalPages > 1) {
                createPagination(currentPage, totalPages, handlePageChange, '#pagination');
            }
        } else {
            hideElement(postList);
            showElement(emptyState);
        }

    } catch (error) {
        console.error('Error loading posts:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || '게시글을 불러오는 중 오류가 발생했습니다.';
        }
        
        showElement(errorBanner);
        hideElement(postList);
        hideElement(emptyState);
        
    } finally {
        hideElement(loading);
    }
}

function createPagination(current, total, onChange, selector) {
    const container = document.querySelector(selector);
    if (!container || total <= 1) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= total; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === current ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        btn.addEventListener('click', () => onChange(i));
        container.appendChild(btn);
    }
    
    showElement(container);
}

function handlePageChange(page) {
    currentPage = page;
    loadPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}