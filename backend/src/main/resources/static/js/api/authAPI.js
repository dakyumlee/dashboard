const AuthAPI = {
    async register(userData) {
        try {
            console.log('Sending register request:', userData);
            const response = await APIClient.post(ENDPOINTS.AUTH.REGISTER, userData);
            console.log('Register response:', response);
            return response;
        } catch (error) {
            console.error('Register API error:', error);
            throw error;
        }
    }
};

console.log('AuthAPI loaded');
