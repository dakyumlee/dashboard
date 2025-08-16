package com.community.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다")
    private String password;

    @NotBlank(message = "회사명은 필수입니다")
    @Size(min = 2, max = 100, message = "회사명은 2자 이상 100자 이하로 입력해주세요")
    private String company;

    @NotBlank(message = "부서는 필수입니다")
    private String department;

    @NotBlank(message = "직군은 필수입니다")
    private String jobPosition;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String company, String department, String jobPosition) {
        this.email = email;
        this.password = password;
        this.company = company;
        this.department = department;
        this.jobPosition = jobPosition;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
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
}