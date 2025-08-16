const APIClient = {
    baseURL: 'http://localhost:8080/api',
    
    async request(method, endpoint, data = null, params = null) {
        try {
            let url = `${this.baseURL}${endpoint}`;
            
            if (params) {
                const searchParams = new URLSearchParams();
                Object.keys(params).forEach(key => {
                    if (params[key] !== null && params[key] !== undefined) {
                        searchParams.append(key, params[key]);
                    }
                });
                if (searchParams.toString()) {
                    url += '?' + searchParams.toString();
                }
            }
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin'
            };
            
            const token = Auth.getToken();
            if (token) {
                options.headers['Authorization'] = `Bearer ${token}`;
            }
            
            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
            }
            
            console.log(`API Request: ${method} ${url}`, data);
            
            const response = await fetch(url, options);
            
            console.log(`API Response Status: ${response.status}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('API Error Response:', errorData);
                
                const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                error.status = response.status;
                throw error;
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('API Success Response:', result);
                return result;
            } else {
                return await response.text();
            }
            
        } catch (error) {
            console.error('API Client Error:', error);
            throw error;
        }
    },
    
    async get(endpoint, params = null) {
        return await this.request('GET', endpoint, null, params);
    },
    
    async post(endpoint, data = null, params = null) {
        return await this.request('POST', endpoint, data, params);
    },
    
    async put(endpoint, data = null, params = null) {
        return await this.request('PUT', endpoint, data, params);
    },
    
    async patch(endpoint, data = null, params = null) {
        return await this.request('PATCH', endpoint, data, params);
    },
    
    async delete(endpoint, params = null) {
        return await this.request('DELETE', endpoint, null, params);
    }
};

console.log('APIClient loaded');