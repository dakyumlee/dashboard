function initHeader() {
    updateHeaderAuth();
    setupHeaderEventListeners();
}

function updateHeaderAuth() {
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
        } else if (adminLink) {
            hideElement(adminLink);
        }
    } else {
        if (navGuest) showElement(navGuest);
        if (navUser) hideElement(navUser);
        if (adminLink) hideElement(adminLink);
    }
}

function setupHeaderEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout(e) {
    e.preventDefault();
    Auth.logout();
    showToast(MESSAGES.LOGOUT_SUCCESS, 'success');
    updateHeaderAuth();
    
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        window.location.href = '/';
    }
}