package com.community.controller;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.LoginResponse;
import com.community.dto.response.UserResponse;
import com.community.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.debug("회원가입 요청 - 이메일: {}", request.getEmail());
            UserResponse response = authService.register(request);
            logger.debug("회원가입 성공 - 이메일: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("회원가입 실패: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.debug("로그인 요청 - 이메일: {}", request.getEmail());
            LoginResponse response = authService.login(request);
            logger.debug("로그인 성공 - 이메일: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("로그인 실패 - 이메일: {}, 오류: {}", request.getEmail(), e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null) {
                logger.warn("인증되지 않은 사용자의 정보 요청");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            String email = authentication.getName();
            logger.debug("현재 사용자 정보 요청 - 이메일: {}", email);
            
            UserResponse response = authService.getCurrentUser(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("현재 사용자 정보 조회 실패: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "사용자 정보 조회 중 오류가 발생했습니다");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "로그아웃 되었습니다");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Auth controller is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}