package com.community.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class NicknameGenerator {

    private final Random random = new Random();

    public String generateNickname(String department) {
        int randomNumber = random.nextInt(999) + 1;
        return department + "-" + String.format("%03d", randomNumber);
    }
}