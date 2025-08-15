const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            console.log(`API 요청: ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, finalOptions);
            
            console.log(`응답 상태: ${response.status}`);

            if (response.status === 401) {
                window.auth.isLoggedIn = false;
                window.auth.currentUser = null;
                window.auth.updateUI();
                alert('로그인이 필요합니다');
                window.location.href = '/';
                return null;
            }

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API 오류:', errorData);
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            console.log('API 응답:', data);
            return data;

        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

const apiClient = new ApiClient();

const postAPI = {
    getAll: (page = 1, size = 10) => apiClient.get(`/posts?page=${page}&size=${size}`),
    getById: (id) => apiClient.get(`/posts/${id}`),
    create: (postData) => apiClient.post('/posts', postData),
    update: (id, postData) => apiClient.put(`/posts/${id}`, postData),
    delete: (id) => apiClient.delete(`/posts/${id}`)
};

const commentAPI = {
    getByPostId: (postId) => apiClient.get(`/posts/${postId}/comments`),
    create: (postId, commentData) => apiClient.post(`/posts/${postId}/comments`, commentData),
    update: (commentId, commentData) => apiClient.put(`/comments/${commentId}`, commentData),
    delete: (commentId) => apiClient.delete(`/comments/${commentId}`)
};

const likeAPI = {
    toggle: (postId) => apiClient.post(`/posts/${postId}/like`)
};

window.apiClient = apiClient;
window.postAPI = postAPI;
window.commentAPI = commentAPI;
window.likeAPI = likeAPI;