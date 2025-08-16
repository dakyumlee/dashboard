const APIClient = {
    async get(endpoint, params = {}) {
        let url = `${API_BASE_URL}${endpoint}`;
        
        if (Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
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

    async post(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
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

    async put(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
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
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
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
    }
};

console.log('APIClient loaded');