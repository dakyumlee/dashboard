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
    const pagination = document.getElementById('pagination');

    try {
        showElement(loading);
        hideElement(errorBanner);
        hideElement(pagination);

        const response = await PostAPI.getPosts(page, PAGINATION.DEFAULT_SIZE);
        
        if (response.posts && response.posts.length > 0) {
            renderPostList(response.posts, postList);
            
            currentPage = response.currentPage || page;
            totalPages = response.totalPages || 1;
            
            createPagination(currentPage, totalPages, handlePageChange, '#pagination');
        } else {
            const emptyState = document.getElementById('empty-state');
            showElement(emptyState);
        }

    } catch (error) {
        console.error('Error loading posts:', error);
        
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || MESSAGES.SERVER_ERROR;
        }
        
        showElement(errorBanner);
        
    } finally {
        hideElement(loading);
    }
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