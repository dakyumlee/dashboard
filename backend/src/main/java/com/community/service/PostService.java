package com.community.service;

import com.community.dto.request.PostRequest;
import com.community.dto.response.PostDetailResponse;
import com.community.dto.response.PostListResponse;
import com.community.entity.Post;
import com.community.entity.User;
import com.community.exception.CustomException;
import com.community.repository.LikeRepository;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

    public PostDetailResponse createPost(PostRequest request, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        Post post = new Post(request.getTitle(), request.getContent(), author);
        Post savedPost = postRepository.save(post);

        return convertToDetailResponse(savedPost, email);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAllPosts(int page, int size, String currentUserEmail) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Post> postsPage = postRepository.findAllOrderByCreatedAtDesc(pageable);

        List<PostListResponse> posts = postsPage.getContent().stream()
                .map(post -> convertToListResponse(post, currentUserEmail))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("currentPage", postsPage.getNumber() + 1);
        response.put("totalPages", postsPage.getTotalPages());
        response.put("totalElements", postsPage.getTotalElements());
        response.put("hasNext", postsPage.hasNext());
        response.put("hasPrevious", postsPage.hasPrevious());

        return response;
    }

    @Transactional(readOnly = true)
    public PostDetailResponse getPostById(Long id, String currentUserEmail) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));

        return convertToDetailResponse(post, currentUserEmail);
    }

    public PostDetailResponse updatePost(Long id, PostRequest request, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new CustomException("게시글을 수정할 권한이 없습니다");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        Post updatedPost = postRepository.save(post);
        return convertToDetailResponse(updatedPost, email);
    }

    public void deletePost(Long id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        if (!post.getAuthor().getEmail().equals(email) && !user.getIsAdmin()) {
            throw new CustomException("게시글을 삭제할 권한이 없습니다");
        }

        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> searchPosts(String keyword, int page, int size, String currentUserEmail) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Post> postsPage = postRepository.findByTitleContainingOrContentContainingOrderByCreatedAtDesc(keyword, pageable);

        List<PostListResponse> posts = postsPage.getContent().stream()
                .map(post -> convertToListResponse(post, currentUserEmail))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("keyword", keyword);
        response.put("currentPage", postsPage.getNumber() + 1);
        response.put("totalPages", postsPage.getTotalPages());
        response.put("totalElements", postsPage.getTotalElements());
        response.put("hasNext", postsPage.hasNext());
        response.put("hasPrevious", postsPage.hasPrevious());

        return response;
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
}