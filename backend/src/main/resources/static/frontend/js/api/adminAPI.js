const AdminAPI = {
    async getAllPosts(page = 1, size = 10) {
        try {
            const response = await APIClient.get(ENDPOINTS.ADMIN.POSTS, {
                page: page,
                size: size
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllComments(page = 1, size = 10) {
        try {
            const response = await APIClient.get(ENDPOINTS.ADMIN.COMMENTS, {
                page: page,
                size: size
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deletePost(postId) {
        try {
            const response = await APIClient.delete(`${ENDPOINTS.ADMIN.POSTS}/${postId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteComment(commentId) {
        try {
            const response = await APIClient.delete(`${ENDPOINTS.ADMIN.COMMENTS}/${commentId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};