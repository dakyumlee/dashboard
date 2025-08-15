const APIClient = {
    async request(method, endpoint, data = null, params = null) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }
        
        const config = {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url.toString(), config);
            
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: '서버 오류가 발생했습니다.' };
                }
                
                const error = new Error(errorData.message || MESSAGES.SERVER_ERROR);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return { success: true };
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            throw error;
        }
    },

    async get(endpoint, params = null) {
        return this.request('GET', endpoint, null, params);
    },

    async post(endpoint, data = {}) {
        return this.request('POST', endpoint, data);
    },

    async put(endpoint, data = {}) {
        return this.request('PUT', endpoint, data);
    },

    async delete(endpoint) {
        return this.request('DELETE', endpoint);
    }
};