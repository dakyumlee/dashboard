package com.community.service;

import com.community.dto.request.CommentRequest;
import com.community.dto.response.CommentResponse;
import com.community.entity.Comment;
import com.community.entity.Post;
import com.community.entity.User;
import com.community.exception.CustomException;
import com.community.repository.CommentRepository;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse createComment(Long postId, CommentRequest request, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));

        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        Comment comment = new Comment(request.getContent(), post, author);
        Comment savedComment = commentRepository.save(comment);

        return convertToResponse(savedComment, email);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCommentsByPostId(Long postId, int page, int size, String currentUserEmail) {
        if (!postRepository.existsById(postId)) {
            throw new CustomException("게시글을 찾을 수 없습니다");
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Comment> commentsPage = commentRepository.findByPostIdOrderByCreatedAtAsc(postId, pageable);

        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(comment -> convertToResponse(comment, currentUserEmail))
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

    public CommentResponse updateComment(Long id, CommentRequest request, String email) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CustomException("댓글을 찾을 수 없습니다"));

        if (!comment.getAuthor().getEmail().equals(email)) {
            throw new CustomException("댓글을 수정할 권한이 없습니다");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);

        return convertToResponse(updatedComment, email);
    }

    public void deleteComment(Long id, String email) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CustomException("댓글을 찾을 수 없습니다"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        if (!comment.getAuthor().getEmail().equals(email) && !user.getIsAdmin()) {
            throw new CustomException("댓글을 삭제할 권한이 없습니다");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse convertToResponse(Comment comment, String currentUserEmail) {
        boolean isAuthor = false;
        if (currentUserEmail != null && comment.getAuthor().getEmail().equals(currentUserEmail)) {
            isAuthor = true;
        }

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getNickname(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                isAuthor
        );
    }
}