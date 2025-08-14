package com.community.dto.response;

public class LoginResponse {

    private String token;
    private String email;
    private String nickname;
    private Boolean isAdmin;

    public LoginResponse() {}

    public LoginResponse(String token, String email, String nickname, Boolean isAdmin) {
        this.token = token;
        this.email = email;
        this.nickname = nickname;
        this.isAdmin = isAdmin;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
}