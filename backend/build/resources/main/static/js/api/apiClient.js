const APIClient = {
    async get(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = Auth.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    async handleResponse(response) {
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

        try {
            return await response.json();
        } catch (error) {
            return {};
        }
    },

    handleError(error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            error.message = MESSAGES.NETWORK_ERROR;
        }
        console.error('API Client error:', error);
        return error;
    }
};

console.log('APIClient loaded');