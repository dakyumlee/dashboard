const PostAPI = {
    async getPosts(page = 1, size = 10) {
        try {
            const response = await APIClient.get(ENDPOINTS.POSTS.LIST, {
                page: page,
                size: size
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getPost(id) {
        try {
            const response = await APIClient.get(`${ENDPOINTS.POSTS.DETAIL}/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createPost(postData) {
        try {
            const response = await APIClient.post(ENDPOINTS.POSTS.CREATE, postData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updatePost(id, postData) {
        try {
            const response = await APIClient.put(`${ENDPOINTS.POSTS.UPDATE}/${id}`, postData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deletePost(id) {
        try {
            const response = await APIClient.delete(`${ENDPOINTS.POSTS.DELETE}/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async toggleLike(postId) {
        try {
            const response = await APIClient.post(`${ENDPOINTS.POSTS.LIKE}/${postId}/like`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getLikeStatus(postId) {
        try {
            const response = await APIClient.get(`${ENDPOINTS.POSTS.LIKE}/${postId}/like-status`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};