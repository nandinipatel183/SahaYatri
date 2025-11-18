package com.practice.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.practice.model.Role;
import com.practice.model.User;
import com.practice.repository.UserRepository;
import com.practice.config.JwtUtil;
import com.practice.dto.LoginRequest;
import com.practice.sevice.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    


        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

            User user = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            // Only VOLUNTEER & ADMIN require approval
            if (!user.isApproved() &&
                    (user.getRole() == Role.ADMIN || user.getRole() == Role.VOLUNTEER)) {

                return ResponseEntity.status(403)
                        .body(Map.of("error", "Account pending admin approval"));
            }

            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole().name(),
                    user.isApproved()
            );

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user
            ));
        }


        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User user) {

            User saved = authService.registerUser(user);

            if (saved == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email already exists"));
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Registration successful, please login."));
        }
   
    @PostMapping("/admin/create-user")
    public ResponseEntity<?> createUserByAdmin(@RequestBody User user, @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String role = jwtUtil.extractRole(token);

        if (!role.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only admin can create new users.");
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Role comes directly from admin
        return ResponseEntity.ok(userRepository.save(user));
    }
   
}
