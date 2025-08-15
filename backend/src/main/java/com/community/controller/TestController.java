package com.community.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    public TestController() {
        System.out.println("TestController 생성됨!");
    }

    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        System.out.println("TestController.hello() 호출됨!");
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Spring Boot!");
        response.put("status", "OK");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> request) {
        System.out.println("TestController.echo() 호출됨: " + request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("received", request);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/simple")
    public String simple() {
        System.out.println("TestController.simple() 호출됨!");
        return "Simple test working!";
    }
}