package com.nt.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class StudentDashBoardDto {
	private String quizTitle;
	private Integer score;
	private Integer totalQuestions;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime attemptedAt;
	
	public StudentDashBoardDto(String quizTitle,Integer score,Integer totalQuestions,LocalDateTime attemptedAt) {
		this.quizTitle = quizTitle;
		this.score = score;
		this.totalQuestions = totalQuestions;
		this.attemptedAt = attemptedAt;
	}

}
