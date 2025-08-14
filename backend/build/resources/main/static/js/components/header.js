function initHeader() {
    updateHeaderUI();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('로그아웃 하시겠습니까?')) {
        Auth.logout();
        window.location.href = 'index.html';
    }
}

function updateHeaderUI() {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const userNickname = document.getElementById('user-nickname');
    const adminLink = document.getElementById('admin-link');
    
    const currentUser = Auth.getCurrentUser();
    
    if (currentUser) {
        hideElement(navGuest);
        showElement(navUser);
        
        if (userNickname) {
            userNickname.textContent = currentUser.nickname;
        }
        
        if (adminLink) {
            if (currentUser.isAdmin) {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        }
    } else {
        showElement(navGuest);
        hideElement(navUser);
        
        if (adminLink) {
            adminLink.classList.add('hidden');
        }
    }
}

function updateHeaderForUser(user) {
    updateHeaderUI();
}