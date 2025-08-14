function initAuth() {
    updateAuthUI();
    setupGlobalEventListeners();
}

function updateAuthUI() {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const userNickname = document.getElementById('user-nickname');
    const adminLink = document.getElementById('admin-link');

    if (Auth.isAuthenticated()) {
        const user = Auth.getCurrentUser();
        
        if (navGuest) hideElement(navGuest);
        if (navUser) showElement(navUser);
        
        if (userNickname && user) {
            userNickname.textContent = user.nickname || user.email;
        }
        
        if (adminLink && user && user.isAdmin) {
            showElement(adminLink);
        }
    } else {
        if (navGuest) showElement(navGuest);
        if (navUser) hideElement(navUser);
        if (adminLink) hideElement(adminLink);
    }
}

function setupGlobalEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
            showToast(MESSAGES.LOGOUT_SUCCESS, 'success');
            updateAuthUI();
            
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                window.location.href = '/';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    
    const currentPage = window.location.pathname;
    
    if (currentPage === '/' || currentPage === '/index.html') {
        if (typeof initHomePage === 'function') {
            initHomePage();
        }
    } else if (currentPage === '/login.html') {
        if (typeof initLoginPage === 'function') {
            initLoginPage();
        }
    } else if (currentPage === '/register.html') {
        if (typeof initRegisterPage === 'function') {
            initRegisterPage();
        }
    } else if (currentPage === '/post-detail.html') {
        if (typeof initPostDetailPage === 'function') {
            initPostDetailPage();
        }
    } else if (currentPage === '/create-post.html') {
        if (typeof initCreatePostPage === 'function') {
            initCreatePostPage();
        }
    } else if (currentPage === '/admin.html') {
        if (typeof initAdminPage === 'function') {
            initAdminPage();
        }
    }
});