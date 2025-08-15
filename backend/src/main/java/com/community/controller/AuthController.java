package com.community.controller;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.UserResponse;
import com.community.service.AuthService;
import com.community.entity.User;
import com.community.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
        try {
            logger.debug("회원가입 요청: {}", request.get("email"));
            
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail((String) request.get("email"));
            registerRequest.setPassword((String) request.get("password"));
            registerRequest.setDepartment((String) request.getOrDefault("department", "개발팀"));
            registerRequest.setJobPosition((String) request.getOrDefault("jobPosition", "신입"));
            
            UserResponse userResponse = authService.register(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "회원가입이 완료되었습니다");
            response.put("user", userResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("회원가입 실패: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> request, HttpSession session) {
        try {
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            
            logger.debug("로그인 요청: {}", email);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다"));

            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다");
            }

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), null, user.getIsAdmin() ? 
                    java.util.List.of(() -> "ROLE_ADMIN") : 
                    java.util.List.of(() -> "ROLE_USER")
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            session.setAttribute("userId", user.getId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("isAdmin", user.getIsAdmin());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "isAdmin", user.getIsAdmin()
            ));

            logger.debug("로그인 성공: {}", user.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("로그인 실패: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        try {
            session.invalidate();
            SecurityContextHolder.clearContext();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그아웃 되었습니다");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "로그아웃 중 오류가 발생했습니다");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(errorResponse);
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

            Map<String, Object> response = new HashMap<>();
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "department", user.getDepartment(),
                "jobPosition", user.getJobPosition(),
                "isAdmin", user.getIsAdmin()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
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