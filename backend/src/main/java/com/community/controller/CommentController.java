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
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId,
                                                        @Valid @RequestBody CommentRequest request,
                                                        Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        
        String email = authentication.getName();
        CommentResponse response = commentService.createComment(postId, request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable Long postId,
                                                          @RequestParam(defaultValue = "1") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Map<String, Object> response = commentService.getCommentsByPostId(postId, page, size, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long commentId,
                                                        @Valid @RequestBody CommentRequest request,
                                                        Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        
        String email = authentication.getName();
        CommentResponse response = commentService.updateComment(commentId, request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                             Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        
        String email = authentication.getName();
        commentService.deleteComment(commentId, email);
        return ResponseEntity.ok().build();
    }
}