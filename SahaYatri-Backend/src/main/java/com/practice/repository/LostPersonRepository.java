package com.practice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.model.LostPerson;



public interface LostPersonRepository extends JpaRepository<LostPerson, Long> {
	 List<LostPerson> findByUserEmail(String userEmail);
	LostPerson findByPhotoUrls(String result); }
