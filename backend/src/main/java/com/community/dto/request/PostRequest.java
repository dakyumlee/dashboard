package com.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostRequest {

    @NotBlank(message = "제목을 입력해주세요")
    @Size(min = 2, max = 255, message = "제목은 2자 이상 255자 이하로 입력해주세요")
    private String title;

    @NotBlank(message = "내용을 입력해주세요")
    @Size(min = 10, max = 5000, message = "내용은 10자 이상 5000자 이하로 입력해주세요")
    private String content;

    public PostRequest() {}

    public PostRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}