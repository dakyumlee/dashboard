package com.community.service;

import com.community.dto.response.CommentResponse;
import com.community.dto.response.PostListResponse;
import com.community.entity.Comment;
import com.community.entity.Post;
import com.community.exception.CustomException;
import com.community.repository.CommentRepository;
import com.community.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public AdminService(PostRepository postRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Post> postsPage = postRepository.findAllOrderByCreatedAtDesc(pageable);

        List<PostListResponse> posts = postsPage.getContent().stream()
                .map(post -> {
                    int commentCount = (int) commentRepository.countByPostId(post.getId());
                    return new PostListResponse(
                            post.getId(),
                            post.getTitle(),
                            post.getAuthor().getNickname(),
                            post.getCreatedAt(),
                            post.getLikeCount(),
                            commentCount,
                            false
                    );
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("currentPage", postsPage.getNumber() + 1);
        response.put("totalPages", postsPage.getTotalPages());
        response.put("totalElements", postsPage.getTotalElements());
        response.put("hasNext", postsPage.hasNext());
        response.put("hasPrevious", postsPage.hasPrevious());

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllComments(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Comment> commentsPage = commentRepository.findAllOrderByCreatedAtDesc(pageable);

        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getNickname(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt(),
                        false
                ))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        response.put("currentPage", commentsPage.getNumber() + 1);
        response.put("totalPages", commentsPage.getTotalPages());
        response.put("totalElements", commentsPage.getTotalElements());
        response.put("hasNext", commentsPage.hasNext());
        response.put("hasPrevious", commentsPage.hasPrevious());

        return response;
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));
        postRepository.delete(post);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CustomException("댓글을 찾을 수 없습니다"));
        commentRepository.delete(comment);
    }
}