package com.community.controller;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.UserResponse;
import com.community.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request, 
                                                    HttpServletRequest httpRequest) {
        try {
            logger.debug("로그인 요청 수신: {}", request.getEmail());
            
            UserResponse user = authService.authenticate(request);
            
            String role = user.getIsAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
            
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    user.getEmail(), 
                    null, 
                    Collections.singletonList(new SimpleGrantedAuthority(role))
                );
            
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authToken);
            SecurityContextHolder.setContext(securityContext);
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
            session.setAttribute("user", user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그인되었습니다");
            response.put("user", Map.of(
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "isAdmin", user.getIsAdmin()
            ));
            
            logger.debug("로그인 성공: {}", request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("로그인 실패: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.debug("회원가입 요청 수신: {}", request.getEmail());
            
            UserResponse user = authService.register(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다");
            response.put("user", Map.of(
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "isAdmin", user.getIsAdmin()
            ));
            
            logger.debug("회원가입 성공: {}", request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("회원가입 실패: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다"));
            }
            
            UserResponse user = (UserResponse) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "세션이 만료되었습니다"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", Map.of(
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "isAdmin", user.getIsAdmin()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("현재 사용자 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "서버 오류"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            
            SecurityContextHolder.clearContext();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그아웃되었습니다");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("로그아웃 실패: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "로그아웃 실패"));
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