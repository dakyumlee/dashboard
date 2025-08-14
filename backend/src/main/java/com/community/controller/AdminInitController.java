package com.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/init")
public class AdminInitController {

    @Autowired
    private DataSource dataSource;

    @PostMapping("/admin")
    public ResponseEntity<?> createAdmin() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Connection conn = dataSource.getConnection();
            
            String checkSql = "SELECT COUNT(*) FROM users WHERE email = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setString(1, "admin@admin.com");
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next() && rs.getInt(1) > 0) {
                result.put("message", "관리자 계정이 이미 존재합니다.");
                result.put("email", "admin@admin.com");
                result.put("password", "admin123");
                conn.close();
                return ResponseEntity.ok(result);
            }
            
            String insertSql = "INSERT INTO users (id, email, password, nickname, department, job_position, role, created_at, updated_at) VALUES (user_seq.nextval, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(insertSql);
            
            stmt.setString(1, "admin@admin.com");
            stmt.setString(2, "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.");
            stmt.setString(3, "관리자-001");
            stmt.setString(4, "관리팀");
            stmt.setString(5, "관리자");
            stmt.setString(6, "ADMIN");
            stmt.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setTimestamp(8, Timestamp.valueOf(LocalDateTime.now()));
            
            int rows = stmt.executeUpdate();
            conn.close();
            
            if (rows > 0) {
                result.put("success", true);
                result.put("message", "관리자 계정이 생성되었습니다.");
                result.put("email", "admin@admin.com");
                result.put("password", "admin123");
            } else {
                result.put("success", false);
                result.put("message", "계정 생성에 실패했습니다.");
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/test-user")
    public ResponseEntity<?> createTestUser() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Connection conn = dataSource.getConnection();
            
            String checkSql = "SELECT COUNT(*) FROM users WHERE email = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setString(1, "test@test.com");
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next() && rs.getInt(1) > 0) {
                result.put("message", "테스트 계정이 이미 존재합니다.");
                result.put("email", "test@test.com");
                result.put("password", "test123");
                conn.close();
                return ResponseEntity.ok(result);
            }
            
            String insertSql = "INSERT INTO users (id, email, password, nickname, department, job_position, role, created_at, updated_at) VALUES (user_seq.nextval, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(insertSql);
            
            stmt.setString(1, "test@test.com");
            stmt.setString(2, "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.");
            stmt.setString(3, "개발팀-001");
            stmt.setString(4, "개발팀");
            stmt.setString(5, "개발자");
            stmt.setString(6, "USER");
            stmt.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setTimestamp(8, Timestamp.valueOf(LocalDateTime.now()));
            
            int rows = stmt.executeUpdate();
            conn.close();
            
            if (rows > 0) {
                result.put("success", true);
                result.put("message", "테스트 계정이 생성되었습니다.");
                result.put("email", "test@test.com");
                result.put("password", "test123");
            } else {
                result.put("success", false);
                result.put("message", "계정 생성에 실패했습니다.");
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(result);
    }
}