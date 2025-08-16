document.addEventListener('DOMContentLoaded', function() {
    if (typeof initHeader === 'function') {
        initHeader();
    }
    
    const pageName = getPageName();
    
    switch (pageName) {
        case 'index':
            if (typeof initHomePage === 'function') {
                initHomePage();
            }
            break;
        case 'login':
            if (typeof initLoginPage === 'function') {
                initLoginPage();
            }
            break;
        case 'register':
            if (typeof initRegisterPage === 'function') {
                initRegisterPage();
            }
            break;
        case 'create-post':
            if (typeof initCreatePostPage === 'function') {
                initCreatePostPage();
            }
            break;
        case 'edit-post':
            if (typeof initEditPostPage === 'function') {
                initEditPostPage();
            }
            break;
        case 'post-detail':
            if (typeof initPostDetailPage === 'function') {
                initPostDetailPage();
            }
            break;
        case 'admin':
            if (typeof initAdminPage === 'function') {
                initAdminPage();
            }
            break;
    }
});

function getPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    
    if (fileName === '' || fileName === 'index.html') {
        return 'index';
    }
    
    return fileName.replace('.html', '');
}

console.log('App loaded');