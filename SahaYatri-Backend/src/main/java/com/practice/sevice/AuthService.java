package com.practice.sevice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practice.model.Role;
import com.practice.model.User;
import com.practice.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User authenticateUser(String email, String password) {

        User u = userRepository.findByEmail(email);

        if (u != null && passwordEncoder.matches(password, u.getPassword())) {
            return u;
        }

        return null;
    }

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) return null;

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // PUBLIC user auto-approved
        if (user.getRole() == null || user.getRole() == Role.USER) {
            user.setRole(Role.USER);
            user.setApproved(true);
        }
        // ADMIN & VOLUNTEER need admin approval
        else if (user.getRole() == Role.ADMIN || user.getRole() == Role.VOLUNTEER) {
            user.setApproved(false);
        }

        return userRepository.save(user);
    }
}
