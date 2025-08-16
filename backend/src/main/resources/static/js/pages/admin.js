let currentTab = 'posts';
let currentPage = 0;
let selectedItems = new Set();

function initAdminPage() {
    if (!Auth.requireAuth()) {
        return;
    }
    
    checkAdminPermission();
    setupTabs();
    loadDashboard();
    loadCurrentTab();
}

async function checkAdminPermission() {
    try {
        await AdminAPI.checkAdmin();
    } catch (error) {
        alert('관리자 권한이 필요합니다.');
        window.location.href = 'index.html';
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    currentTab = tabName;
    currentPage = 0;
    selectedItems.clear();
    
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`${tabName}-section`).classList.remove('hidden');
    
    loadCurrentTab();
}

async function loadDashboard() {
    try {
        const stats = await AdminAPI.getDashboard();
        updateDashboardStats(stats);
        
        const companiesData = await AdminAPI.getCompaniesStats();
        updateCompaniesStats(companiesData.companies);
    } catch (error) {
        console.error('대시보드 로드 실패:', error);
    }
}

function updateDashboardStats(stats) {
    const totalUsersElement = document.getElementById('total-users');
    const totalPostsElement = document.getElementById('total-posts');
    const totalCommentsElement = document.getElementById('total-comments');
    
    if (totalUsersElement) totalUsersElement.textContent = stats.totalUsers;
    if (totalPostsElement) totalPostsElement.textContent = stats.totalPosts;
    if (totalCommentsElement) totalCommentsElement.textContent = stats.totalComments;
}

function updateCompaniesStats(companies) {
    const companiesGrid = document.getElementById('companies-grid');
    if (!companiesGrid) return;
    
    companiesGrid.innerHTML = '';
    
    const sortedCompanies = Object.entries(companies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    sortedCompanies.forEach(([company, count]) => {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'company-stat';
        companyDiv.innerHTML = `
            <h4>${escapeHtml(company)}</h4>
            <div class="count">${count}</div>
        `;
        companiesGrid.appendChild(companyDiv);
    });
}

async function loadCurrentTab() {
    switch (currentTab) {
        case 'posts':
            await loadPosts();
            break;
        case 'comments':
            await loadComments();
            break;
        case 'users':
            await loadUsers();
            break;
    }
}

async function loadPosts() {
    const loading = document.getElementById('posts-loading');
    const errorElement = document.getElementById('posts-error');
    const content = document.getElementById('posts-content');
    const tbody = document.getElementById('posts-tbody');
    const total = document.getElementById('posts-total');
    
    try {
        showElement(loading);
        hideElement(errorElement);
        hideElement(content);
        
        const response = await AdminAPI.getAllPosts(currentPage, 10);
        
        if (total) {
            total.textContent = response.totalElements;
        }
        
        tbody.innerHTML = '';
        
        response.posts.forEach(post => {
            const row = createPostRow(post);
            tbody.appendChild(row);
        });
        
        updatePagination('posts', response);
        
        hideElement(loading);
        showElement(content);
        
    } catch (error) {
        hideElement(loading);
        showError(errorElement, error.message);
        console.error('게시글 로드 실패:', error);
    }
}

function createPostRow(post) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="item-checkbox" data-id="${post.id}">
        </td>
        <td>${post.id}</td>
        <td>
            <a href="post-detail.html?id=${post.id}" class="post-link">
                ${escapeHtml(post.title)}
            </a>
        </td>
        <td>${escapeHtml(post.authorNickname)}</td>
        <td>${formatDate(post.createdAt)}</td>
        <td>${post.likeCount}</td>
        <td>${post.commentCount || 0}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">
                삭제
            </button>
        </td>
    `;
    
    const checkbox = row.querySelector('.item-checkbox');
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            selectedItems.add(post.id);
        } else {
            selectedItems.delete(post.id);
        }
        updateBatchActions();
    });
    
    return row;
}

async function loadComments() {
    const loading = document.getElementById('comments-loading');
    const errorElement = document.getElementById('comments-error');
    const content = document.getElementById('comments-content');
    const tbody = document.getElementById('comments-tbody');
    const total = document.getElementById('comments-total');
    
    try {
        showElement(loading);
        hideElement(errorElement);
        hideElement(content);
        
        const response = await AdminAPI.getAllComments(currentPage, 10);
        
        if (total) {
            total.textContent = response.totalElements;
        }
        
        tbody.innerHTML = '';
        
        response.comments.forEach(comment => {
            const row = createCommentRow(comment);
            tbody.appendChild(row);
        });
        
        updatePagination('comments', response);
        
        hideElement(loading);
        showElement(content);
        
    } catch (error) {
        hideElement(loading);
        showError(errorElement, error.message);
        console.error('댓글 로드 실패:', error);
    }
}

function createCommentRow(comment) {
    const row = document.createElement('tr');
    
    const truncatedContent = comment.content.length > 50 
        ? comment.content.substring(0, 50) + '...' 
        : comment.content;
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="item-checkbox" data-id="${comment.id}">
        </td>
        <td>${comment.id}</td>
        <td title="${escapeHtml(comment.content)}">${escapeHtml(truncatedContent)}</td>
        <td>
            <a href="post-detail.html?id=${comment.postId}" class="post-link">
                ${escapeHtml(comment.postTitle)}
            </a>
        </td>
        <td>${escapeHtml(comment.authorNickname)}</td>
        <td>${formatDate(comment.createdAt)}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteComment(${comment.id})">
                삭제
            </button>
        </td>
    `;
    
    const checkbox = row.querySelector('.item-checkbox');
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            selectedItems.add(comment.id);
        } else {
            selectedItems.delete(comment.id);
        }
        updateBatchActions();
    });
    
    return row;
}

async function loadUsers() {
    const loading = document.getElementById('users-loading');
    const errorElement = document.getElementById('users-error');
    const content = document.getElementById('users-content');
    const tbody = document.getElementById('users-tbody');
    const total = document.getElementById('users-total');
    
    try {
        showElement(loading);
        hideElement(errorElement);
        hideElement(content);
        
        const response = await AdminAPI.getAllUsers(currentPage, 10);
        
        if (total) {
            total.textContent = response.totalElements;
        }
        
        tbody.innerHTML = '';
        
        response.users.forEach(user => {
            const row = createUserRow(user);
            tbody.appendChild(row);
        });
        
        updatePagination('users', response);
        
        hideElement(loading);
        showElement(content);
        
    } catch (error) {
        hideElement(loading);
        showError(errorElement, error.message);
        console.error('사용자 로드 실패:', error);
    }
}

function createUserRow(user) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${escapeHtml(user.nickname)}</td>
        <td>${escapeHtml(user.company)}</td>
        <td>${escapeHtml(user.department)}</td>
        <td>${escapeHtml(user.jobPosition)}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td>${user.isAdmin ? '관리자' : '일반'}</td>
        <td>${user.postCount}</td>
        <td>${user.commentCount}</td>
    `;
    
    return row;
}

function updatePagination(type, response) {
    const pagination = document.getElementById(`${type}-pagination`);
    const prevBtn = document.getElementById(`${type}-prev-btn`);
    const nextBtn = document.getElementById(`${type}-next-btn`);
    const pageNumbers = document.getElementById(`${type}-page-numbers`);
    
    if (!pagination) return;
    
    prevBtn.disabled = !response.hasPrevious;
    nextBtn.disabled = !response.hasNext;
    
    prevBtn.onclick = () => {
        if (response.hasPrevious) {
            currentPage--;
            loadCurrentTab();
        }
    };
    
    nextBtn.onclick = () => {
        if (response.hasNext) {
            currentPage++;
            loadCurrentTab();
        }
    };
    
    pageNumbers.innerHTML = '';
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(response.totalPages - 1, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'btn btn-outline btn-sm';
        pageBtn.textContent = i + 1;
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.onclick = () => {
            currentPage = i;
            loadCurrentTab();
        };
        
        pageNumbers.appendChild(pageBtn);
    }
    
    showElement(pagination);
}

function updateBatchActions() {
    const batchActions = document.getElementById('batch-actions');
    const selectedCount = document.getElementById('selected-count');
    
    if (selectedItems.size > 0) {
        if (selectedCount) {
            selectedCount.textContent = selectedItems.size;
        }
        showElement(batchActions);
    } else {
        hideElement(batchActions);
    }
}

async function deletePost(id) {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await AdminAPI.deletePost(id);
        alert('게시글이 삭제되었습니다.');
        loadCurrentTab();
    } catch (error) {
        alert('게시글 삭제에 실패했습니다: ' + error.message);
    }
}

async function deleteComment(id) {
    if (!confirm('이 댓글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await AdminAPI.deleteComment(id);
        alert('댓글이 삭제되었습니다.');
        loadCurrentTab();
    } catch (error) {
        alert('댓글 삭제에 실패했습니다: ' + error.message);
    }
}

async function batchDelete() {
    if (selectedItems.size === 0) {
        alert('삭제할 항목을 선택해주세요.');
        return;
    }
    
    const itemType = currentTab === 'posts' ? '게시글' : '댓글';
    if (!confirm(`선택한 ${selectedItems.size}개의 ${itemType}을 삭제하시겠습니까?`)) {
        return;
    }
    
    try {
        const ids = Array.from(selectedItems);
        
        if (currentTab === 'posts') {
            await AdminAPI.deletePosts(ids);
        } else if (currentTab === 'comments') {
            await AdminAPI.deleteComments(ids);
        }
        
        alert(`${selectedItems.size}개의 ${itemType}이 삭제되었습니다.`);
        selectedItems.clear();
        loadCurrentTab();
    } catch (error) {
        alert(`일괄 삭제에 실패했습니다: ${error.message}`);
    }
}

function selectAll() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
        const id = parseInt(cb.dataset.id);
        if (cb.checked) {
            selectedItems.add(id);
        } else {
            selectedItems.delete(id);
        }
    });
    
    updateBatchActions();
}

const AdminAPI = {
    async checkAdmin() {
        const response = await fetch('/api/admin/check-admin', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('관리자 권한이 없습니다');
        }
        
        return await response.json();
    },
    
    async getDashboard() {
        const response = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('대시보드 정보를 불러올 수 없습니다');
        }
        
        return await response.json();
    },
    
    async getCompaniesStats() {
        const response = await fetch('/api/admin/companies', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('회사별 통계를 불러올 수 없습니다');
        }
        
        return await response.json();
    },
    
    async getAllPosts(page = 0, size = 10) {
        const response = await fetch(`/api/admin/posts?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('게시글 목록을 불러올 수 없습니다');
        }
        
        return await response.json();
    },
    
    async getAllComments(page = 0, size = 10) {
        const response = await fetch(`/api/admin/comments?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('댓글 목록을 불러올 수 없습니다');
        }
        
        return await response.json();
    },
    
    async getAllUsers(page = 0, size = 10) {
        const response = await fetch(`/api/admin/users?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('사용자 목록을 불러올 수 없습니다');
        }
        
        return await response.json();
    },
    
    async deletePost(id) {
        const response = await fetch(`/api/admin/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('게시글을 삭제할 수 없습니다');
        }
        
        return await response.json();
    },
    
    async deleteComment(id) {
        const response = await fetch(`/api/admin/comments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('댓글을 삭제할 수 없습니다');
        }
        
        return await response.json();
    },
    
    async deletePosts(ids) {
        const response = await fetch('/api/admin/posts/batch', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids })
        });
        
        if (!response.ok) {
            throw new Error('게시글을 일괄 삭제할 수 없습니다');
        }
        
        return await response.json();
    },
    
    async deleteComments(ids) {
        const response = await fetch('/api/admin/comments/batch', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids })
        });
        
        if (!response.ok) {
            throw new Error('댓글을 일괄 삭제할 수 없습니다');
        }
        
        return await response.json();
    }
};

document.addEventListener('DOMContentLoaded', initAdminPage);