package com.community.controller;

import com.community.dto.request.CommentRequest;
import com.community.dto.response.CommentResponse;
import com.community.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId, 
                                                        @Valid @RequestBody CommentRequest request,
                                                        Authentication authentication) {
        String email = authentication.getName();
        CommentResponse response = commentService.createComment(postId, request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Map<String, Object>> getCommentsByPostId(@PathVariable Long postId,
                                                                  @RequestParam(defaultValue = "1") int page,
                                                                  @RequestParam(defaultValue = "10") int size,
                                                                  Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> response = commentService.getCommentsByPostId(postId, page, size, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id,
                                                        @Valid @RequestBody CommentRequest request,
                                                        Authentication authentication) {
        String email = authentication.getName();
        CommentResponse response = commentService.updateComment(id, request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        commentService.deleteComment(id, email);
        
        return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다"));
    }
}