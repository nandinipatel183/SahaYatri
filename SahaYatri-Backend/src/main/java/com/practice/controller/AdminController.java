package com.practice.controller;

import com.practice.model.Role;
import com.practice.model.User;
import com.practice.repository.UserRepository;
import com.practice.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
	
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    
    // VALIDATE ADMIN TOKEN
    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        return jwtUtil.extractRole(token).equals("ADMIN");
    }
    /** GET ALL USERS */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String auth) {

        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Not authorized");

        return ResponseEntity.ok(userRepository.findAll());
    }
    /** APPROVE USER */
    @PatchMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String auth) {

        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Not authorized");

        var user = userRepository.findById(id);

        if (user.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        user.get().setApproved(true);
        userRepository.save(user.get());

        return ResponseEntity.ok(Map.of("message", "User approved"));
    }


    /** CHANGE ROLE */
    @PatchMapping("/role/{id}")
    public ResponseEntity<?> changeRole(
            @PathVariable Long id,
            @RequestParam String role,
            @RequestHeader("Authorization") String auth) {

        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Not authorized");

        var u = userRepository.findById(id);

        if (u.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        u.get().setRole(Role.valueOf(role));
        userRepository.save(u.get());

        return ResponseEntity.ok(Map.of("message", "Role updated"));
    }


    /** DELETE USER */
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String auth) {

        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Not authorized");

        userRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }
}
