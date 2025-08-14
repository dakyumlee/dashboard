package com.community.controller;

import com.community.entity.Post;
import com.community.entity.User;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            System.out.println("getPosts request - page: " + page + ", size: " + size);
            
            Pageable pageable = PageRequest.of(page - 1, size);
            Page<Post> postPage = postRepository.findAllOrderByCreatedAtDesc(pageable);
            
            List<Map<String, Object>> posts = postPage.getContent().stream()
                .map(post -> {
                    Map<String, Object> postMap = new HashMap<>();
                    postMap.put("id", post.getId());
                    postMap.put("title", post.getTitle());
                    postMap.put("content", post.getContent());
                    postMap.put("authorNickname", post.getAuthor().getNickname());
                    postMap.put("createdAt", post.getCreatedAt().toString());
                    postMap.put("likeCount", post.getLikeCount());
                    postMap.put("commentCount", post.getCommentCount());
                    return postMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts);
            response.put("currentPage", page);
            response.put("totalPages", postPage.getTotalPages());
            response.put("totalElements", postPage.getTotalElements());
            
            System.out.println("DB에서 " + posts.size() + "개 게시글 조회 완료");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("getPosts error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "게시글 조회 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("createPost request received: " + request);
            
            String title = (String) request.get("title");
            String content = (String) request.get("content");
            
            if (title == null || title.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "제목을 입력해주세요.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (content == null || content.trim().length() < 10) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "내용을 최소 10자 이상 입력해주세요.");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            System.out.println("DB에서 사용자 조회 중...");
            long userCount = userRepository.count();
            System.out.println("총 사용자 수: " + userCount);
            
            List<User> users = userRepository.findAll();
            System.out.println("실제 조회된 사용자 수: " + users.size());
            
            if (users.isEmpty()) {
                System.err.println("사용자가 없습니다. 하드코딩된 사용자를 생성합니다.");
                
                User hardcodedUser = new User();
                hardcodedUser.setEmail("system@test.com");
                hardcodedUser.setPassword("encoded_password");
                hardcodedUser.setDepartment("시스템");
                hardcodedUser.setJobPosition("관리자");
                hardcodedUser.setNickname("시스템-001");
                
                User savedUser = userRepository.save(hardcodedUser);
                System.out.println("하드코딩된 사용자 생성 완료 - ID: " + savedUser.getId());
                users.add(savedUser);
            }
            
            User author = users.get(0);
            System.out.println("사용할 작성자: " + author.getEmail() + " (" + author.getNickname() + ")");
            
            Post newPost = new Post(title.trim(), content.trim(), author);
            Post savedPost = postRepository.save(newPost);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedPost.getId());
            response.put("title", savedPost.getTitle());
            response.put("content", savedPost.getContent());
            response.put("authorNickname", savedPost.getAuthor().getNickname());
            response.put("createdAt", savedPost.getCreatedAt().toString());
            response.put("likeCount", savedPost.getLikeCount());
            response.put("commentCount", savedPost.getCommentCount());
            
            System.out.println("DB에 새 게시글 저장 완료 - ID: " + savedPost.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("createPost error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "게시글 작성 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        try {
            long totalPosts = postRepository.count();
            long totalUsers = userRepository.count();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post controller is working with DB!");
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            response.put("totalPosts", String.valueOf(totalPosts));
            response.put("totalUsers", String.valueOf(totalUsers));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "DB 연결 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}