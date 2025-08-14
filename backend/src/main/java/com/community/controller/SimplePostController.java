package com.community.controller;

import com.community.entity.Post;
import com.community.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test")
public class SimplePostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/posts")
    public ResponseEntity<?> getTestPosts() {
        try {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Post> posts = postRepository.findAllOrderByCreatedAtDesc(pageable);
            
            List<Map<String, Object>> responses = posts.getContent().stream()
                    .map(post -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", post.getId());
                        map.put("title", post.getTitle());
                        map.put("authorNickname", post.getAuthor().getNickname());
                        map.put("createdAt", post.getCreatedAt());
                        map.put("likeCount", post.getLikeCount());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "게시글을 불러올 수 없습니다.");
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "서버가 정상 동작 중입니다.");
        return ResponseEntity.ok(response);
    }
}