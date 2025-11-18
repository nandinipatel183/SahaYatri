package com.practice.controller;

import com.practice.model.*;
import com.practice.sevice.UserReportsService;
import com.practice.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/my")
@CrossOrigin(origins = "http://localhost:5173")
public class UserReportsController {

    private final UserReportsService reportsService;

    @Autowired
    private JwtUtil jwtUtil;

    public UserReportsController(UserReportsService reportsService) {
        this.reportsService = reportsService;
    }

    private String extractEmailFromAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) return null;
        return jwtUtil.extractEmail(token);
    }

    @GetMapping("/lost-persons")
    public ResponseEntity<?> myLostPersons(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = extractEmailFromAuth(auth);
        if (email == null) return ResponseEntity.status(403).body("Not authorized");
        List<LostPerson> list = reportsService.getMyLostPersons(email);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/found-persons")
    public ResponseEntity<?> myFoundPersons(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = extractEmailFromAuth(auth);
        if (email == null) return ResponseEntity.status(403).body("Not authorized");
        List<FoundPerson> list = reportsService.getMyFoundPersons(email);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/lost-items")
    public ResponseEntity<?> myLostItems(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = extractEmailFromAuth(auth);
        if (email == null) return ResponseEntity.status(403).body("Not authorized");
        List<LostItem> list = reportsService.getMyLostItems(email);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/found-items")
    public ResponseEntity<?> myFoundItems(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = extractEmailFromAuth(auth);
        if (email == null) return ResponseEntity.status(403).body("Not authorized");
        List<FoundItem> list = reportsService.getMyFoundItems(email);
        return ResponseEntity.ok(list);
    }
}
