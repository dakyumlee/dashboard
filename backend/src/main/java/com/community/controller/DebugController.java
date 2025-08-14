package com.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-status")
    public ResponseEntity<?> checkDbStatus() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Connection conn = dataSource.getConnection();
            result.put("connection", "SUCCESS");
            result.put("database", conn.getMetaData().getDatabaseProductName());
            result.put("url", conn.getMetaData().getURL());
            
            Statement stmt = conn.createStatement();
            
            try {
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM users");
                if (rs.next()) {
                    result.put("userCount", rs.getInt("count"));
                } else {
                    result.put("userCount", "NO_DATA");
                }
            } catch (Exception e) {
                result.put("userCount", "TABLE_ERROR: " + e.getMessage());
            }
            
            try {
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM posts");
                if (rs.next()) {
                    result.put("postCount", rs.getInt("count"));
                } else {
                    result.put("postCount", "NO_DATA");
                }
            } catch (Exception e) {
                result.put("postCount", "TABLE_ERROR: " + e.getMessage());
            }
            
            conn.close();
            result.put("status", "OK");
            
        } catch (Exception e) {
            result.put("connection", "FAILED");
            result.put("error", e.getMessage());
            result.put("status", "ERROR");
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/posts-raw")
    public ResponseEntity<?> getRawPosts() {
        List<Map<String, Object>> posts = new ArrayList<>();
        
        try {
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT p.id, p.title, p.created_at, u.nickname " +
                "FROM posts p JOIN users u ON p.author_id = u.id " +
                "ORDER BY p.created_at DESC LIMIT 10"
            );
            
            while (rs.next()) {
                Map<String, Object> post = new HashMap<>();
                post.put("id", rs.getLong("id"));
                post.put("title", rs.getString("title"));
                post.put("authorNickname", rs.getString("nickname"));
                post.put("createdAt", rs.getTimestamp("created_at"));
                posts.add(post);
            }
            
            conn.close();
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "DB 조회 실패");
            e.printStackTrace();
            return ResponseEntity.status(500).body(error);
        }
        
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/tables")
    public ResponseEntity<?> checkTables() {
        List<String> tables = new ArrayList<>();
        
        try {
            Connection conn = dataSource.getConnection();
            ResultSet rs = conn.getMetaData().getTables(null, null, "%", new String[]{"TABLE"});
            
            while (rs.next()) {
                tables.add(rs.getString("TABLE_NAME"));
            }
            
            conn.close();
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
        
        return ResponseEntity.ok(tables);
    }
}