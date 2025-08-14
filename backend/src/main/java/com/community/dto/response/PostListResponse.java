package com.community.dto.response;

import java.time.LocalDateTime;

public class PostListResponse {

    private Long id;
    private String title;
    private String authorNickname;
    private LocalDateTime createdAt;
    private int likeCount;
    private boolean isLiked;

    public PostListResponse() {}

    public PostListResponse(Long id, String title, String authorNickname, LocalDateTime createdAt, int likeCount, boolean isLiked) {
        this.id = id;
        this.title = title;
        this.authorNickname = authorNickname;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.isLiked = isLiked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorNickname() {
        return authorNickname;
    }

    public void setAuthorNickname(String authorNickname) {
        this.authorNickname = authorNickname;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }
}