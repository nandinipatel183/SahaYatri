package com.practice.repository;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.model.LostItem;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByUserEmail(String userEmail);

}

