const API_BASE_URL = 'http://localhost:8080/api';

const PAGINATION = {
    DEFAULT_SIZE: 10,
    MAX_SIZE: 50
};

const MESSAGES = {
    SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    LOGIN_REQUIRED: '로그인이 필요합니다.',
    REGISTER_SUCCESS: '회원가입이 완료되었습니다.',
    LOGIN_SUCCESS: '로그인되었습니다.',
    LOGOUT_SUCCESS: '로그아웃되었습니다.'
};

const ROUTES = {
    HOME: '/',
    LOGIN: '/login.html',
    REGISTER: '/register.html',
    CREATE_POST: '/create-post.html',
    POST_DETAIL: '/post-detail.html'
};