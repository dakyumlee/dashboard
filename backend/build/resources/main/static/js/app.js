document.addEventListener('DOMContentLoaded', async function() {
    await initApp();
});

async function initApp() {
    try {
        initHeader();
        await Auth.updateHeaderUI();
        
        const currentPage = getCurrentPage();
        await initPageSpecificCode(currentPage);
        
    } catch (error) {
        console.error('App initialization error:', error);
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    switch(filename) {
        case 'index.html':
        case '':
            return 'home';
        case 'login.html':
            return 'login';
        case 'register.html':
            return 'register';
        case 'create-post.html':
            return 'create-post';
        case 'edit-post.html':
            return 'edit-post';
        case 'post-detail.html':
            return 'post-detail';
        case 'admin.html':
            return 'admin';
        default:
            return 'unknown';
    }
}

async function initPageSpecificCode(page) {
    switch(page) {
        case 'home':
            if (typeof initHomePage === 'function') {
                await initHomePage();
            }
            break;
        case 'login':
            if (typeof initLoginPage === 'function') {
                await initLoginPage();
            }
            break;
        case 'register':
            if (typeof initRegisterPage === 'function') {
                await initRegisterPage();
            }
            break;
        case 'create-post':
            if (typeof initCreatePostPage === 'function') {
                await initCreatePostPage();
            }
            break;
        case 'edit-post':
            if (typeof initEditPostPage === 'function') {
                await initEditPostPage();
            }
            break;
        case 'post-detail':
            if (typeof initPostDetailPage === 'function') {
                await initPostDetailPage();
            }
            break;
        case 'admin':
            if (typeof initAdminPage === 'function') {
                await initAdminPage();
            }
            break;
    }
}

function updateAuthUI(user) {
    updateHeaderForUser(user);
}