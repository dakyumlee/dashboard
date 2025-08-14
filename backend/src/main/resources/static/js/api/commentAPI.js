const CommentAPI = {
    async getComments(postId, page = 1, size = 10) {
        try {
            const response = await APIClient.get(`${ENDPOINTS.COMMENTS.LIST}/${postId}/comments`, {
                page: page,
                size: size
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createComment(postId, commentData) {
        try {
            const response = await APIClient.post(`${ENDPOINTS.COMMENTS.CREATE}/${postId}/comments`, commentData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateComment(commentId, commentData) {
        try {
            const response = await APIClient.put(`${ENDPOINTS.COMMENTS.UPDATE}/${commentId}`, commentData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteComment(commentId) {
        try {
            const response = await APIClient.delete(`${ENDPOINTS.COMMENTS.DELETE}/${commentId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};