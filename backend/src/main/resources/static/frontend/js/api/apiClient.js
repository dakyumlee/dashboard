const APIClient = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...Auth.getAuthHeader(),
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                Auth.logout();
                throw new Error(MESSAGES.UNAUTHORIZED);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || MESSAGES.SERVER_ERROR);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            throw error;
        }
    },

    async get(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.append(key, value);
            }
        });
        
        return this.request(url.pathname + url.search);
    },

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    },

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};