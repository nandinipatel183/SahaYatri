package com.practice.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.model.FoundPerson;

public interface FoundPersonRepository extends JpaRepository<FoundPerson, Long> { 
	List<FoundPerson> findByUserEmail(String userEmail);
}


