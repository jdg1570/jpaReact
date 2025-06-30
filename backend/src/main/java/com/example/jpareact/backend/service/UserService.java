package com.example.jpareact.backend.service;

import com.example.jpareact.backend.dto.UserResDto;
import com.example.jpareact.backend.entity.UserEntity;
import com.example.jpareact.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository  userRepository;

    public List<UserResDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResDto::fromEntity)
                .toList();
    }
}
