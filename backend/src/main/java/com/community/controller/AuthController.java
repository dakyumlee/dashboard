package com.community.controller;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.LoginResponse;
import com.community.dto.response.UserResponse;
import com.community.entity.User;
import com.community.repository.UserRepository;
import com.community.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다");
        }
        String email = authentication.getName();
        UserResponse response = authService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin() {
        try {
            boolean adminExists = userRepository.existsByRole("ADMIN");
            if (adminExists) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "관리자 계정이 이미 존재합니다");
                return ResponseEntity.ok(response);
            }

            String email = "admin@company.com";
            String password = "admin123!";
            
            if (userRepository.existsByEmail(email)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "해당 이메일로 이미 가입된 계정이 있습니다");
                return ResponseEntity.ok(response);
            }

            String encodedPassword = passwordEncoder.encode(password);
            String nickname = "관리자";

            User admin = new User(email, encodedPassword, "관리", "관리자", nickname);
            admin.setRole("ADMIN");
            
            userRepository.save(admin);

            Map<String, String> response = new HashMap<>();
            response.put("message", "관리자 계정이 생성되었습니다");
            response.put("email", email);
            response.put("password", password);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "관리자 계정 생성 실패: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Auth controller is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}