const APIClient = {
    async post(endpoint, data = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API Request:', url, data);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
    }
};

console.log('APIClient loaded');
