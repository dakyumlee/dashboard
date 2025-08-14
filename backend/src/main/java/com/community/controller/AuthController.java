package com.community.controller;

import com.community.entity.User;
import com.community.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("Register request received: " + request);
            
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            String department = (String) request.get("department");
            String jobPosition = (String) request.get("jobPosition");
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (password == null || password.trim().length() < 8) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "비밀번호는 8자 이상이어야 합니다.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (department == null || department.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "부서를 선택해주세요.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (jobPosition == null || jobPosition.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "직급을 선택해주세요.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (userRepository.existsByEmail(email)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "이미 가입된 이메일입니다.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            String encodedPassword = passwordEncoder.encode(password);
            String nickname = department + "-" + String.format("%03d", (int)(Math.random() * 999) + 1);
            
            User newUser = new User();
            newUser.setEmail(email.trim());
            newUser.setPassword(encodedPassword);
            newUser.setDepartment(department.trim());
            newUser.setJobPosition(jobPosition.trim());
            newUser.setNickname(nickname);
            
            User savedUser = userRepository.save(newUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "회원가입이 완료되었습니다");
            response.put("email", savedUser.getEmail());
            response.put("nickname", savedUser.getNickname());
            
            System.out.println("새 사용자 생성 완료 - ID: " + savedUser.getId() + ", 닉네임: " + savedUser.getNickname());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Register error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("Login request received: " + request);
            
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "이메일 또는 비밀번호가 올바르지 않습니다");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "이메일 또는 비밀번호가 올바르지 않습니다");
                return ResponseEntity.status(401).body(errorResponse);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", "dummy-jwt-token-" + user.getId());
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("isAdmin", user.getIsAdmin());
            
            System.out.println("로그인 성공 - 사용자: " + user.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
            
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