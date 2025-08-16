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

console.log('Helpers loaded');