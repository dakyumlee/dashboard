package com.community.service;

import com.community.entity.Like;
import com.community.entity.Post;
import com.community.entity.User;
import com.community.exception.CustomException;
import com.community.repository.LikeRepository;
import com.community.repository.PostRepository;
import com.community.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> toggleLike(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException("게시글을 찾을 수 없습니다"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(user.getId(), postId);

        boolean isLiked;
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            Like newLike = new Like(user, post);
            likeRepository.save(newLike);
            isLiked = true;
        }

        long likeCount = likeRepository.countByPostId(postId);

        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", likeCount);
        response.put("message", isLiked ? "좋아요를 눌렀습니다" : "좋아요를 취소했습니다");

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLikeStatus(Long postId, String email) {
        if (!postRepository.existsById(postId)) {
            throw new CustomException("게시글을 찾을 수 없습니다");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        boolean isLiked = likeRepository.existsByUserIdAndPostId(user.getId(), postId);
        long likeCount = likeRepository.countByPostId(postId);

        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", likeCount);

        return response;
    }
}