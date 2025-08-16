package com.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/db")
@CrossOrigin(origins = "*")
public class DatabaseTestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection()) {
            result.put("connected", true);
            result.put("url", conn.getMetaData().getURL());
            result.put("username", conn.getMetaData().getUserName());
            result.put("databaseProduct", conn.getMetaData().getDatabaseProductName());
            result.put("databaseVersion", conn.getMetaData().getDatabaseProductVersion());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("connected", false);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(result);
        }
    }

    @GetMapping("/check-tables")
    public ResponseEntity<Map<String, Object>> checkTables() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            String query = "SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'POSTS', 'COMMENTS', 'LIKES')";
            ResultSet rs = stmt.executeQuery(query);
            
            Map<String, Boolean> tables = new HashMap<>();
            while (rs.next()) {
                tables.put(rs.getString("table_name"), true);
            }
            
            result.put("tables", tables);
            result.put("success", true);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(result);
        }
    }

    @GetMapping("/check-users")
    public ResponseEntity<Map<String, Object>> checkUsers() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            String query = "SELECT COUNT(*) as user_count FROM users";
            ResultSet rs = stmt.executeQuery(query);
            
            if (rs.next()) {
                result.put("userCount", rs.getInt("user_count"));
            }
            
            String sampleQuery = "SELECT email, nickname, role FROM users WHERE ROWNUM <= 3";
            ResultSet sampleRs = stmt.executeQuery(sampleQuery);
            
            java.util.List<Map<String, Object>> users = new java.util.ArrayList<>();
            while (sampleRs.next()) {
                Map<String, Object> user = new HashMap<>();
                user.put("email", sampleRs.getString("email"));
                user.put("nickname", sampleRs.getString("nickname"));
                user.put("role", sampleRs.getString("role"));
                users.add(user);
            }
            
            result.put("sampleUsers", users);
            result.put("success", true);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(result);
        }
    }
}