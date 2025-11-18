package com.practice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
