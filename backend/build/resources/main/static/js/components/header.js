async function initHeader() {
    await Auth.updateHeaderUI();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

async function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('로그아웃 하시겠습니까?')) {
        await Auth.logout();
    }
}

function updateHeaderForUser(user) {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const userNickname = document.getElementById('user-nickname');
    const adminLink = document.getElementById('admin-link');

    if (user) {
        hideElement(navGuest);
        showElement(navUser);
        
        if (userNickname) {
            userNickname.textContent = user.nickname;
        }
        
        if (adminLink) {
            toggleElement(adminLink, user.isAdmin);
        }
    } else {
        showElement(navGuest);
        hideElement(navUser);
    }
}