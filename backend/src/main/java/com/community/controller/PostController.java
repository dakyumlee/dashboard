package com.community.controller;

import com.community.dto.request.PostRequest;
import com.community.dto.response.PostDetailResponse;
import com.community.service.LikeService;
import com.community.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;
    private final LikeService likeService;

    public PostController(PostService postService, LikeService likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<PostDetailResponse> createPost(@Valid @RequestBody PostRequest request, 
                                                        Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        PostDetailResponse response = postService.createPost(request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = authentication != null ? authentication.getName() : null;
        Map<String, Object> response = postService.getAllPosts(page, size, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        PostDetailResponse response = postService.getPostById(id, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDetailResponse> updatePost(@PathVariable Long id, 
                                                        @Valid @RequestBody PostRequest request,
                                                        Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        PostDetailResponse response = postService.updatePost(id, request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        postService.deletePost(id, email);
        
        return ResponseEntity.ok(Map.of("message", "게시글이 삭제되었습니다"));
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = authentication != null ? authentication.getName() : null;
        Map<String, Object> response = postService.searchPosts(keyword, page, size, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        Map<String, Object> response = likeService.toggleLike(id, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> getLikeStatus(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        Map<String, Object> response = likeService.getLikeStatus(id, email);
        return ResponseEntity.ok(response);
    }
}