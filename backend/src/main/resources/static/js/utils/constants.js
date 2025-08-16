const API_BASE_URL = 'http://localhost:8080/api';

const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me'
    },
    POSTS: {
        LIST: '/posts',
        DETAIL: '/posts',
        CREATE: '/posts',
        UPDATE: '/posts',
        DELETE: '/posts',
        LIKE: '/posts'
    }
};

const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

const MESSAGES = {
    NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    LOGIN_SUCCESS: '로그인되었습니다!',
    REGISTER_SUCCESS: '회원가입이 완료되었습니다!'
};

const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 8
};

const DEPARTMENTS = [
    '개발팀', '기획팀', '디자인팀', '마케팅팀', 
    '영업팀', '인사팀', '재무팀', '운영팀'
];

const JOB_ROLES = [
    '신입', '주니어', '시니어', '리드', 
    '매니저', '디렉터', '임원', '기타'
];

const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_SIZE: 10,
    MAX_SIZE: 50
};

console.log('Constants loaded');