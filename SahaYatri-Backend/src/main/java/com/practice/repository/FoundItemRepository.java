package com.practice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.model.FoundItem;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByUserEmail(String userEmail);

}
