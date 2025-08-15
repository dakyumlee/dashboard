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
        CREATE: '/posts',
        DETAIL: '/posts',
        UPDATE: '/posts',
        DELETE: '/posts',
        LIKE: '/posts'
    },
    COMMENTS: {
        LIST: '/posts',
        CREATE: '/posts',
        UPDATE: '/comments',
        DELETE: '/comments'
    },
    ADMIN: {
        POSTS: '/admin/posts',
        COMMENTS: '/admin/comments',
        USERS: '/admin/users'
    }
};

const MESSAGES = {
    NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    REGISTER_SUCCESS: '회원가입이 완료되었습니다!',
    LOGIN_SUCCESS: '로그인되었습니다!',
    LOGOUT_SUCCESS: '로그아웃되었습니다!',
    POST_CREATED: '게시글이 작성되었습니다!',
    POST_UPDATED: '게시글이 수정되었습니다!',
    POST_DELETED: '게시글이 삭제되었습니다!',
    COMMENT_CREATED: '댓글이 작성되었습니다!',
    COMMENT_UPDATED: '댓글이 수정되었습니다!',
    COMMENT_DELETED: '댓글이 삭제되었습니다!'
};

const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 8,
    MIN_TITLE_LENGTH: 5,
    MAX_TITLE_LENGTH: 100,
    MIN_CONTENT_LENGTH: 10,
    MAX_CONTENT_LENGTH: 5000
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
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
};

const UI_STATES = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    IDLE: 'idle'
};

console.log('Constants loaded');