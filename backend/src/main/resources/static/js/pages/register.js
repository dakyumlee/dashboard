function initRegisterPage() {
    if (Auth.redirectIfAuthenticated()) {
        return;
    }

    const form = document.getElementById('register-form');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');

    if (!form) {
        console.error('Register form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideElement(errorBanner);

        const formData = new FormData(form);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            department: formData.get('department'),
            jobPosition: formData.get('jobPosition')
        };

        if (userData.password !== userData.confirmPassword) {
            errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
            showElement(errorBanner);
            return;
        }

        if (userData.password.length < 8) {
            errorMessage.textContent = '비밀번호는 8자 이상이어야 합니다.';
            showElement(errorBanner);
            return;
        }

        if (!userData.department || !userData.jobPosition) {
            errorMessage.textContent = '부서와 직급을 선택해주세요.';
            showElement(errorBanner);
            return;
        }

        try {
            const response = await AuthAPI.register({
                email: userData.email,
                password: userData.password,
                department: userData.department,
                jobPosition: userData.jobPosition
            });

            showToast(MESSAGES.REGISTER_SUCCESS, 'success');
            window.location.href = '/login.html';

        } catch (error) {
            console.error('Register error:', error);
            errorMessage.textContent = error.message || '회원가입 중 오류가 발생했습니다.';
            showElement(errorBanner);
        }
    });
}

function validateFormField(field, minLength = 1) {
    const value = field.value.trim();
    return value.length >= minLength;
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initRegisterPage === 'function') {
        initRegisterPage();
    }
});