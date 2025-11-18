package com.practice.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String SECRET_KEY;
	
	@Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

	 private Key getSigningKey() {
	        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	    }

	 public String generateToken(String email, String role, boolean approved) {
		    return Jwts.builder()
		            .setSubject(email)
		            .claim("role", role)
		            .claim("approved", approved)
		            .setIssuedAt(new Date())
		            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
		            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
		            .compact();
		}

	 public String extractRole(String token) {
		    return (String) Jwts.parserBuilder()
		            .setSigningKey(getSigningKey())
		            .build()
		            .parseClaimsJws(token)
		            .getBody()
		            .get("role");
		}

	    public String extractEmail(String token) {
	        return Jwts.parserBuilder()
	                .setSigningKey(getSigningKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .getSubject();
	    }

	    public boolean validateToken(String token) {
	        try {
	            Jwts.parserBuilder()
	                    .setSigningKey(getSigningKey())
	                    .build()
	                    .parseClaimsJws(token);
	            return true;
	        } catch (Exception e) {
	            System.out.println("❌ Invalid JWT: " + e.getMessage());
	            return false;
	        }
	    }
	}