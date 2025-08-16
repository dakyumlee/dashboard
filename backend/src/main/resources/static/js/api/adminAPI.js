const AdminAPI = {
    async getPosts(page = 1, size = 10) {
        try {
            const params = new URLSearchParams({
                page: page - 1,
                size: size
            });
            
            const response = await APIClient.get(`/admin/posts?${params}`);
            return response;
        } catch (error) {
            console.error('게시글 목록 조회 실패:', error);
            throw error;
        }
    },

    async getComments(page = 1, size = 10) {
        try {
            const params = new URLSearchParams({
                page: page - 1,
                size: size
            });
            
            const response = await APIClient.get(`/admin/comments?${params}`);
            return response;
        } catch (error) {
            console.error('댓글 목록 조회 실패:', error);
            throw error;
        }
    },

    async deletePost(postId) {
        try {
            const response = await APIClient.delete(`/admin/posts/${postId}`);
            return response;
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            throw error;
        }
    },

    async deleteComment(commentId) {
        try {
            const response = await APIClient.delete(`/admin/comments/${commentId}`);
            return response;
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            throw error;
        }
    }
};

console.log('AdminAPI loaded');