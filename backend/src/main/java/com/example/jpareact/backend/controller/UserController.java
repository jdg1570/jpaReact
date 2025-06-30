package com.example.jpareact.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3003")
public class UserController {

    @GetMapping("getUser")
    public ModelAndView getUser(HttpServletRequest request) {
        return new ModelAndView("user/user");
    }

}
