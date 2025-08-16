const APIClient = {
    async request(method, endpoint, data = null, params = null) {
        let url = `${API_BASE_URL}${endpoint}`;
        
        if (params) {
            const urlParams = new URLSearchParams(params);
            url += `?${urlParams}`;
        }
        
        console.log('API Request:', method, url, data);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                
                const error = new Error(errorData.message || MESSAGES.SERVER_ERROR);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            const responseData = await response.json();
            console.log('API Response data:', responseData);
            return responseData;
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client error:', error);
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

console.log('APIClient loaded');