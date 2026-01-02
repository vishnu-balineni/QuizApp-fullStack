package com.nt.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nt.entity.User;
import com.nt.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository UserRepo;
	
	public String registerUser(User user) {
		
		Optional<User> existingUser = UserRepo.findByUsername(user.getUsername());
		if(existingUser.isPresent()) {
			throw new RuntimeException("username  already exists");
		}
		UserRepo.save(user);
		return "registration completed succesfully";
		
	}
	// Change return type from String -> User
    public User loginUser(String username, String password) {
        Optional<User> userOpt = UserRepo.findByUsername(username);
        
        if(userOpt.isPresent()) {
            User user1 = userOpt.get();
            if(user1.getPassword().equals(password)) {
                return user1; // <--- Return the WHOLE Object, not just a string
            } else {
                throw new RuntimeException("Invalid username or password");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }	
}
