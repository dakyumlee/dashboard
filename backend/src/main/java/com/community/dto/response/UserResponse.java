package com.community.dto.response;

public class UserResponse {

    private Long id;
    private String email;
    private String nickname;
    private String department;
    private String jobPosition;
    private Boolean isAdmin;

    public UserResponse() {}

    public UserResponse(Long id, String email, String nickname, String department, String jobPosition, Boolean isAdmin) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.department = department;
        this.jobPosition = jobPosition;
        this.isAdmin = isAdmin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
}