package com.example.jpareact.backend.dto;

import com.example.jpareact.backend.entity.UserEntity;

public record UserResDto (
    Long id,
    String name,
    String email,
    int age,
    String gender,
    String status
){
    public static UserResDto fromEntity(UserEntity user) {
        return new UserResDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getGender(),
                user.getStatus()
        );
    }

}
