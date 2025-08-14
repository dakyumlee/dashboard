package com.community.controller;

import com.community.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> response = adminService.getAllPosts(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/comments")
    public ResponseEntity<Map<String, Object>> getAllComments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> response = adminService.getAllComments(page, size);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id) {
        adminService.deleteComment(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "댓글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }
}