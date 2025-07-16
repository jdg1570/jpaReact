package com.example.jpareact.backend.controller;

import com.example.jpareact.backend.dto.UserResDto;
import com.example.jpareact.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("getUser")
    public ModelAndView getUser(HttpServletRequest request) {
        return new ModelAndView("user/user");
    }


    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResDto>> getAllUsers() {
        List<UserResDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
