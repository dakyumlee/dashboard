const APIClient = {
    _getHeaders() {
        return {
            'Content-Type': 'application/json'
        };
    },

    _buildUrl(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    },

    async _handleResponse(response) {
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
    },

    async get(endpoint, params = {}) {
        const url = this._buildUrl(endpoint, params);
        console.log('API GET Request:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this._getHeaders(),
                credentials: 'include'
            });
            
            return await this._handleResponse(response);
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client GET error:', error);
            throw error;
        }
    },

    async post(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API POST Request:', url, data);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this._getHeaders(),
                credentials: 'include',
                body: JSON.stringify(data)
            });
            
            return await this._handleResponse(response);
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client POST error:', error);
            throw error;
        }
    },

    async put(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API PUT Request:', url, data);
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: this._getHeaders(),
                credentials: 'include',
                body: JSON.stringify(data)
            });
            
            return await this._handleResponse(response);
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client PUT error:', error);
            throw error;
        }
    },

    async delete(endpoint) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API DELETE Request:', url);
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this._getHeaders(),
                credentials: 'include'
            });
            
            return await this._handleResponse(response);
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client DELETE error:', error);
            throw error;
        }
    }
};

console.log('APIClient loaded');