function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

function toggleElement(element, show) {
    if (element) {
        if (show) {
            showElement(element);
        } else {
            hideElement(element);
        }
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
        return '방금 전';
    } else if (diffMins < 60) {
        return `${diffMins}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function updateQueryParam(name, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(name, value);
    } else {
        url.searchParams.delete(name);
    }
    window.history.replaceState({}, '', url);
}

function createErrorElement(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-banner';
    errorDiv.innerHTML = `
        <div class="error-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    return errorDiv;
}

function createLoadingElement(message = '로딩 중...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>${escapeHtml(message)}</p>
    `;
    return loadingDiv;
}

function renderPostList(posts, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostCard(post);
        container.appendChild(postElement);
    });
}

function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.innerHTML = `
        <div class="post-header">
            <div class="post-meta">
                <span class="author">${escapeHtml(post.authorName || post.author)}</span>
                <span class="date">${formatDate(post.createdAt)}</span>
            </div>
        </div>
        <div class="post-content">
            <h3><a href="post-detail.html?id=${post.id}">${escapeHtml(post.title)}</a></h3>
            <p>${escapeHtml(truncateText(post.content, 200))}</p>
        </div>
        <div class="post-footer">
            <div class="post-stats">
                <span class="likes">
                    <i class="icon-heart"></i>
                    ${formatNumber(post.likeCount || 0)}
                </span>
                <span class="comments">
                    <i class="icon-comment"></i>
                    ${formatNumber(post.commentCount || 0)}
                </span>
            </div>
        </div>
    `;
    return article;
}

console.log('Helpers loaded');