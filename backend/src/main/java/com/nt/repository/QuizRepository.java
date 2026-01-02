package com.nt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nt.entity.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz,Long> {
	
	List<Quiz> findByCategory(String category);

    // 2. Find by Title (Search feature)
    // We use 'ContainingIgnoreCase' so "java" finds "Java Basics" and "Advanced Java"
    List<Quiz> findByTitleContainingIgnoreCase(String title);
    
    Optional<Quiz> findById(Long id);

	List<Quiz> findByTeacherId(Long teacherId);
	
    

}
