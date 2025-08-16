package com.community.controller;

import com.community.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin(Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        boolean isAdmin = isAdminUser(email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isAdmin", isAdmin);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        Map<String, Object> response = adminService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        Map<String, Object> response = adminService.getAllPosts(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/comments")
    public ResponseEntity<Map<String, Object>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        Map<String, Object> response = adminService.getAllComments(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        Map<String, Object> response = adminService.getAllUsers(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/companies")
    public ResponseEntity<Map<String, Object>> getCompaniesStats(Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        Map<String, Long> companiesStats = adminService.getCompaniesStats();
        Map<String, Object> response = new HashMap<>();
        response.put("companies", companiesStats);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id, Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        adminService.deletePost(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id, Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        adminService.deleteComment(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "댓글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/posts/batch")
    public ResponseEntity<Map<String, String>> deletePosts(@RequestBody Map<String, Object> request, Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        @SuppressWarnings("unchecked")
        java.util.List<Long> ids = (java.util.List<Long>) request.get("ids");
        adminService.deletePosts(ids);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", ids.size() + "개의 게시글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/batch")
    public ResponseEntity<Map<String, String>> deleteComments(@RequestBody Map<String, Object> request, Authentication authentication) {
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }
        
        if (!isAdminUser(email)) {
            throw new RuntimeException("관리자 권한이 필요합니다");
        }
        
        @SuppressWarnings("unchecked")
        java.util.List<Long> ids = (java.util.List<Long>) request.get("ids");
        adminService.deleteComments(ids);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", ids.size() + "개의 댓글이 삭제되었습니다");
        
        return ResponseEntity.ok(response);
    }

    private boolean isAdminUser(String email) {
        if (email == null) {
            return false;
        }
        
        if ("admin@communityblind.com".equals(email)) {
            return true;
        }
        
        return "admin@test.com".equals(email) || 
               "admin@admin.com".equals(email) ||
               email.startsWith("admin@");
    }
}