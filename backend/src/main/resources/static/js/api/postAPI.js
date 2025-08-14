const PostAPI = {
    async getPosts(page = 1, size = PAGINATION.DEFAULT_SIZE) {
        return await apiClient.get('/posts', { page, size });
    },

    async getPost(id) {
        return await apiClient.get(`/posts/${id}`);
    },

    async createPost(postData) {
        return await apiClient.post('/posts', postData);
    },

    async updatePost(id, postData) {
        return await apiClient.put(`/posts/${id}`, postData);
    },

    async deletePost(id) {
        return await apiClient.delete(`/posts/${id}`);
    },

    async toggleLike(id) {
        return await apiClient.post(`/posts/${id}/like`);
    },

    async getComments(postId, page = 1, size = PAGINATION.DEFAULT_SIZE) {
        return await apiClient.get(`/posts/${postId}/comments`, { page, size });
    },

    async createComment(postId, commentData) {
        return await apiClient.post(`/posts/${postId}/comments`, commentData);
    },

    async updateComment(postId, commentId, commentData) {
        return await apiClient.put(`/posts/${postId}/comments/${commentId}`, commentData);
    },

    async deleteComment(postId, commentId) {
        return await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    }
};