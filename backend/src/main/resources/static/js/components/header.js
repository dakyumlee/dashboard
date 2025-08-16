function initHeader() {
    Auth.updateHeaderUI();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('로그아웃 하시겠습니까?')) {
        Auth.logout();
    }
}

function updateHeaderForUser(user) {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const userNickname = document.getElementById('user-nickname');
    const adminLink = document.getElementById('admin-link');

    if (user) {
        if (navGuest) navGuest.classList.add('hidden');
        if (navUser) navUser.classList.remove('hidden');
        
        if (userNickname) {
            userNickname.textContent = user.nickname;
        }
        
        if (adminLink) {
            if (user.isAdmin) {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        }
    } else {
        if (navGuest) navGuest.classList.remove('hidden');
        if (navUser) navUser.classList.add('hidden');
    }
}

console.log('Header loaded');