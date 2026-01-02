package com.nt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.nt.entity.User;

import com.nt.service.UserService;

@RestController
@RequestMapping("/api/quiz/auth")
@CrossOrigin("/**")
public class UserController {
	@Autowired
	private UserService UserService;
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody User user){
			try {
				String output = UserService.registerUser(user);
				return ResponseEntity.ok("User Registered :" + user.getUsername());
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(e.getMessage());
			}
		
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User loginRequest){
		try {
			User user  = UserService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
			return ResponseEntity.ok(user);
		}catch(Exception e) {
			return ResponseEntity.status(401).body(e.getMessage());
		}
	}
	
	
}
