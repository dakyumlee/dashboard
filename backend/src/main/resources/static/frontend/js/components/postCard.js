function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card card';
    postCard.addEventListener('click', () => {
        window.location.href = `post-detail.html?id=${post.id}`;
    });

    postCard.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${sanitizeHTML(post.title)}</h3>
        </div>
        
        <div class="post-content">
            <p class="post-preview">${sanitizeHTML(truncateText(post.content))}</p>
        </div>
        
        <div class="post-meta">
            <div class="post-author">
                <span class="author-nickname">${sanitizeHTML(post.authorNickname)}</span>
                <span class="post-date">${formatDate(post.createdAt)}</span>
            </div>
            
            <div class="post-stats">
                <span class="like-count">
                    ❤️ ${post.likeCount || 0}
                </span>
                <span class="comment-count">
                    💬 ${post.commentCount || 0}
                </span>
            </div>
        </div>
    `;

    return postCard;
}

function renderPostList(posts, container) {
    if (!container) return;

    container.innerHTML = '';

    if (posts.length === 0) {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            showElement(emptyState);
        }
        return;
    }

    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        hideElement(emptyState);
    }

    posts.forEach(post => {
        const postCard = createPostCard(post);
        container.appendChild(postCard);
    });
}