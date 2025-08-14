package com.community.dto.response;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private String authorNickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAuthor;

    public CommentResponse() {}

    public CommentResponse(Long id, String content, String authorNickname, 
                          LocalDateTime createdAt, LocalDateTime updatedAt, boolean isAuthor) {
        this.id = id;
        this.content = content;
        this.authorNickname = authorNickname;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isAuthor = isAuthor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isAuthor() {
        return isAuthor;
    }

    public void setAuthor(boolean author) {
        isAuthor = author;
    }
}