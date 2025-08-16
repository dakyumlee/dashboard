const APIClient = {
    async request(method, url, data = null) {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (typeof Auth !== 'undefined') {
            const token = Auth.getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    if (typeof Auth !== 'undefined') {
                        Auth.logout();
                    }
                    throw new Error('로그인이 필요합니다');
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    },

    async get(url) {
        return this.request('GET', url);
    },

    async post(url, data) {
        return this.request('POST', url, data);
    },

    async put(url, data) {
        return this.request('PUT', url, data);
    },

    async delete(url) {
        return this.request('DELETE', url);
    }
};

console.log('APIClient loaded');