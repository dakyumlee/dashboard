package com.community.controller;

import com.community.dto.request.PostRequest;
import com.community.dto.response.PostDetailResponse;
import com.community.dto.response.PostListResponse;
import com.community.entity.Post;
import com.community.entity.User;
import com.community.repository.LikeRepository;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostRequest request, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
            }

            String userEmail = authentication.getName();
            User author = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Post post = new Post(request.getTitle(), request.getContent(), author);
            Post savedPost = postRepository.save(post);

            PostDetailResponse response = convertToDetailResponse(savedPost, userEmail);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "게시글 작성에 실패했습니다."));
        }
    }

    @GetMapping
    public ResponseEntity<List<PostListResponse>> getAllPosts(Authentication authentication) {
        String currentUserEmail = authentication != null ? authentication.getName() : null;
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Post> posts = postRepository.findAllOrderByCreatedAtDesc(pageable);
        
        List<PostListResponse> responses = posts.getContent().stream()
                .map(post -> convertToListResponse(post, currentUserEmail))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id, Authentication authentication) {
        try {
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

            String currentUserEmail = authentication != null ? authentication.getName() : null;
            PostDetailResponse response = convertToDetailResponse(post, currentUserEmail);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", "게시글을 찾을 수 없습니다."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody PostRequest request, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
            }

            String userEmail = authentication.getName();
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            boolean isAdmin = currentUser.getIsAdmin();
            if (!post.getAuthor().getId().equals(currentUser.getId()) && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("message", "게시글을 수정할 권한이 없습니다."));
            }

            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setUpdatedAt(LocalDateTime.now());

            Post updatedPost = postRepository.save(post);
            PostDetailResponse response = convertToDetailResponse(updatedPost, userEmail);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "게시글 수정에 실패했습니다."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
            }

            String userEmail = authentication.getName();
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            boolean isAdmin = currentUser.getIsAdmin();
            if (!post.getAuthor().getId().equals(currentUser.getId()) && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("message", "게시글을 삭제할 권한이 없습니다."));
            }

            postRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "게시글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "게시글 삭제에 실패했습니다."));
        }
    }

    private PostDetailResponse convertToDetailResponse(Post post, String currentUserEmail) {
        boolean isLiked = false;
        boolean isAuthor = false;
        
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null) {
                isLiked = likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
                isAuthor = post.getAuthor().getId().equals(currentUser.getId());
            }
        }

        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLikeCount(),
                isLiked,
                isAuthor
        );
    }

    private PostListResponse convertToListResponse(Post post, String currentUserEmail) {
        boolean isLiked = false;
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null) {
                isLiked = likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            }
        }

        return new PostListResponse(
                post.getId(),
                post.getTitle(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                post.getLikeCount(),
                isLiked
        );
    }
}