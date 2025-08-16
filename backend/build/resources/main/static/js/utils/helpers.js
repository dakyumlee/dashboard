function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

function toggleElement(element, show) {
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
}

function setLoading(button, loading = true) {
    if (!button) return;
    
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = '처리 중...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

function showNotification(message, type = 'info') {
    alert(message);
}

function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.add('hidden');
        element.textContent = '';
    });
    
    const inputElements = form.querySelectorAll('.form-control');
    inputElements.forEach(element => element.classList.remove('error'));
}

function addInputError(input, message) {
    input.classList.add('error');
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return '방금 전';
    } else if (diffMins < 60) {
        return `${diffMins}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR');
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
}

function showError(element, message) {
    if (element) {
        const errorMessage = element.querySelector('p') || element;
        errorMessage.textContent = message;
        showElement(element);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('Helpers loaded');