package com.community.controller;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.LoginResponse;
import com.community.dto.response.UserResponse;
import com.community.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            logger.info("로그인 요청 - 이메일: {}", request.getEmail());
            LoginResponse response = authService.login(request);
            logger.info("로그인 성공 - 이메일: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("로그인 실패 - 이메일: {}, 오류: {}", request.getEmail(), e.getMessage());
            
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setMessage(e.getMessage());
            
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
    
    public static class ErrorResponse {
        private String message;
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        try {
            logger.info("회원가입 요청 - 이메일: {}", request.getEmail());
            UserResponse response = authService.register(request);
            logger.info("회원가입 성공 - 이메일: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("회원가입 실패 - 이메일: {}, 오류: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("테스트 엔드포인트 호출됨");
        return ResponseEntity.ok("Auth controller is working!");
    }
}