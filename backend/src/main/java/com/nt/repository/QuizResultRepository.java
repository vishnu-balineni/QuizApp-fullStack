package com.nt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nt.entity.QuizResult;

public interface QuizResultRepository extends JpaRepository<QuizResult,Long>{
	// Find by Student (You likely already have this)
    List<QuizResult> findByStudentId(Long studentId);

 // Existing method (keeps returning everyone for the Teacher Dashboard calculations)
    List<QuizResult> findByQuizIdOrderByScoreDesc(Long quizId);

    // NEW METHOD: Fetches only the Top 10 highest scores
    List<QuizResult> findTop10ByQuizIdOrderByScoreDesc(Long quizId);
    
    List<QuizResult> findByStudentIdOrderByAttemptedAtDesc(Long studentid);
    List<QuizResult> findByQuizId(Long quizId);

    
}
