package com.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequest {

    @NotBlank(message = "댓글 내용을 입력해주세요")
    @Size(min = 1, max = 1000, message = "댓글은 1자 이상 1000자 이하로 입력해주세요")
    private String content;

    public CommentRequest() {}

    public CommentRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}