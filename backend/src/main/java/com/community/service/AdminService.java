package com.community.service;

import com.community.dto.response.CommentResponse;
import com.community.dto.response.PostListResponse;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public AdminService(PostRepository postRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();

        Map<String, Long> companiesStats = getCompaniesStats();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalPosts", totalPosts);
        stats.put("totalComments", totalComments);
        stats.put("companiesStats", companiesStats);

        return stats;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getCompaniesStats() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .collect(Collectors.groupingBy(
                        this::extractCompanyFromEmail,
                        Collectors.counting()
                ));
    }

    private String extractCompanyFromEmail(User user) {
        String email = user.getEmail();
        if (email.contains("@")) {
            String domain = email.split("@")[1];
            switch (domain.toLowerCase()) {
                case "gmail.com":
                case "naver.com":
                case "hanmail.net":
                case "daum.net":
                case "yahoo.com":
                case "hotmail.com":
                    return "개인 이메일";
                default:
                    return domain.split("\\.")[0];
            }
        }
        return "알 수 없음";
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postsPage = postRepository.findAllOrderByCreatedAtDesc(pageable);

        List<Map<String, Object>> posts = postsPage.getContent().stream()
                .map(post -> {
                    Map<String, Object> postMap = new HashMap<>();
                    postMap.put("id", post.getId());
                    postMap.put("title", post.getTitle());
                    postMap.put("authorNickname", post.getAuthor().getNickname());
                    postMap.put("createdAt", post.getCreatedAt());
                    postMap.put("likeCount", post.getLikeCount());
                    postMap.put("commentCount", post.getCommentCount());
                    postMap.put("isLiked", false);
                    return postMap;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("currentPage", postsPage.getNumber());
        response.put("totalPages", postsPage.getTotalPages());
        response.put("totalElements", postsPage.getTotalElements());
        response.put("hasNext", postsPage.hasNext());
        response.put("hasPrevious", postsPage.hasPrevious());

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllComments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
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
        response.put("currentPage", commentsPage.getNumber());
        response.put("totalPages", commentsPage.getTotalPages());
        response.put("totalElements", commentsPage.getTotalElements());
        response.put("hasNext", commentsPage.hasNext());
        response.put("hasPrevious", commentsPage.hasPrevious());

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAll(pageable);

        List<Map<String, Object>> users = usersPage.getContent().stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("email", user.getEmail());
                    userMap.put("nickname", user.getNickname());
                    userMap.put("company", extractCompanyFromEmail(user));
                    userMap.put("department", user.getDepartment());
                    userMap.put("jobPosition", user.getJobPosition());
                    userMap.put("createdAt", user.getCreatedAt());
                    userMap.put("isAdmin", user.getIsAdmin());
                    
                    long postCount = postRepository.findAll().stream()
                            .filter(p -> p.getAuthor().getId().equals(user.getId()))
                            .count();
                    userMap.put("postCount", postCount);
                    userMap.put("commentCount", commentRepository.countByAuthorId(user.getId()));
                    
                    return userMap;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("currentPage", usersPage.getNumber());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("totalElements", usersPage.getTotalElements());
        response.put("hasNext", usersPage.hasNext());
        response.put("hasPrevious", usersPage.hasPrevious());

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

    public void deletePosts(List<Long> ids) {
        List<Post> posts = postRepository.findAllById(ids);
        postRepository.deleteAll(posts);
    }

    public void deleteComments(List<Long> ids) {
        List<Comment> comments = commentRepository.findAllById(ids);
        commentRepository.deleteAll(comments);
    }
}