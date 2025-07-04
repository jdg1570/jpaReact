package com.example.jpareact.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3003")
public class TestController {

    @GetMapping("/api/hello")
    public String hello() {
        return "hello, World!";
    }
}
