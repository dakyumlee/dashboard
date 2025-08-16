package com.community.service;

import com.community.dto.request.LoginRequest;
import com.community.dto.request.RegisterRequest;
import com.community.dto.response.LoginResponse;
import com.community.dto.response.UserResponse;
import com.community.entity.User;
import com.community.exception.CustomException;
import com.community.repository.UserRepository;
import com.community.util.JwtUtil;
import com.community.util.NicknameGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final NicknameGenerator nicknameGenerator;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtUtil jwtUtil, NicknameGenerator nicknameGenerator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.nicknameGenerator = nicknameGenerator;
    }

    public LoginResponse login(LoginRequest request) {
        logger.debug("로그인 시도 - 이메일: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("사용자를 찾을 수 없음 - 이메일: {}", request.getEmail());
                    return new CustomException("이메일 또는 비밀번호가 올바르지 않습니다");
                });

        logger.debug("사용자 찾음 - ID: {}, 이메일: {}", user.getId(), user.getEmail());
        logger.debug("입력된 비밀번호: {}", request.getPassword());
        logger.debug("DB 저장된 비밀번호: {}", user.getPassword());

        if (!request.getPassword().equals(user.getPassword())) {
            logger.warn("비밀번호 불일치 - 사용자 ID: {}", user.getId());
            throw new CustomException("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        logger.debug("로그인 성공 - 사용자 ID: {}", user.getId());
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getIsAdmin());

        return new LoginResponse(token, user.getEmail(), user.getNickname(), user.getIsAdmin());
    }

    public UserResponse register(RegisterRequest request) {
        logger.debug("회원가입 시도 - 이메일: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("이미 가입된 이메일 - 이메일: {}", request.getEmail());
            throw new CustomException("이미 가입된 이메일입니다");
        }

        String encodedPassword = request.getPassword();
        String nickname = nicknameGenerator.generateNickname(request.getDepartment());

        logger.debug("닉네임 생성 완료: {}", nickname);

        User user = new User(
                request.getEmail(),
                encodedPassword,
                request.getDepartment(),
                request.getJobPosition(),
                nickname
        );

        try {
            User savedUser = userRepository.save(user);
            logger.debug("사용자 저장 완료 - ID: {}", savedUser.getId());

            return new UserResponse(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getNickname(),
                    savedUser.getDepartment(),
                    savedUser.getJobPosition(),
                    savedUser.getIsAdmin()
            );
        } catch (Exception e) {
            logger.error("회원가입 실패: {}", e.getMessage(), e);
            throw new CustomException("회원가입 중 오류가 발생했습니다");
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("사용자를 찾을 수 없습니다"));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getDepartment(),
                user.getJobPosition(),
                user.getIsAdmin()
        );
    }
}