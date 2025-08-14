function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.innerHTML = `
        <div class="post-card-header">
            <h3 class="post-title">
                <a href="post-detail.html?id=${post.id}">${sanitizeHTML(post.title)}</a>
            </h3>
            <div class="post-meta">
                <span class="post-author">${sanitizeHTML(post.authorNickname)}</span>
                <span class="post-date">${formatDateTime(post.createdAt)}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${sanitizeHTML(truncateText(post.content, 150))}</p>
        </div>
        <div class="post-stats">
            <span class="post-likes">❤️ ${post.likeCount || 0}</span>
            <span class="post-comments">💬 ${post.commentCount || 0}</span>
        </div>
    `;
    
    return postCard;
}

function renderPostList(posts, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="empty-message">게시글이 없습니다.</p>';
        return;
    }
    
    posts.forEach(post => {
        const postCard = createPostCard(post);
        container.appendChild(postCard);
    });
}