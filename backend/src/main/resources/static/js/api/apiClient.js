const APIClient = {
    async get(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        console.log('API GET Request:', url.toString());
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                }
            });
            
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

    async post(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API POST Request:', url, data);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
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

    async put(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API PUT Request:', url, data);
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
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
            return responseData;
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client error:', error);
            throw error;
        }
    },

    async delete(endpoint) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API DELETE Request:', url);
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                }
            });
            
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
            return responseData;
            
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                error.message = MESSAGES.NETWORK_ERROR;
            }
            console.error('API Client error:', error);
            throw error;
        }
    },

    getAuthHeader() {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        return token ? `Bearer ${token}` : '';
    }
};

console.log('APIClient loaded');