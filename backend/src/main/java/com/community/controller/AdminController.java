package com.community.controller;

import com.community.dto.response.PostListResponse;
import com.community.entity.Post;
import com.community.entity.User;
import com.community.repository.LikeRepository;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPostsForAdmin(@RequestParam(defaultValue = "0") int page, 
                                                @RequestParam(defaultValue = "10") int size,
                                                Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
            }

            String userEmail = authentication.getName();
            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (!currentUser.getIsAdmin()) {
                return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = postRepository.findAllOrderByCreatedAtDesc(pageable);

            List<PostListResponse> responses = posts.getContent().stream()
                    .map(post -> convertToListResponse(post, userEmail))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("content", responses);
            response.put("totalPages", posts.getTotalPages());
            response.put("totalElements", posts.getTotalElements());
            response.put("currentPage", page);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "게시글 목록을 불러올 수 없습니다."));
        }
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getAllCommentsForAdmin(@RequestParam(defaultValue = "0") int page, 
                                                   @RequestParam(defaultValue = "10") int size,
                                                   Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
            }

            String userEmail = authentication.getName();
            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (!currentUser.getIsAdmin()) {
                return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("content", List.of());
            response.put("totalPages", 0);
            response.put("totalElements", 0);
            response.put("currentPage", page);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "댓글 목록을 불러올 수 없습니다."));
        }
    }

    private PostListResponse convertToListResponse(Post post, String currentUserEmail) {
        boolean isLiked = false;
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null) {
                isLiked = likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            }
        }

        return new PostListResponse(
                post.getId(),
                post.getTitle(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                post.getLikeCount(),
                isLiked
        );
    }
}