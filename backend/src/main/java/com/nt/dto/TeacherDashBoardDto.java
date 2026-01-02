package com.nt.dto;

import java.util.List;

import lombok.Data;

@Data
public class TeacherDashBoardDto {
	private String title;
	private int totalAttempts;
	private double averageScore;
	private List<LeaderBoardDto> studentResults;
	
	public TeacherDashBoardDto(String title,int totalAttempts,double averageScore,List<LeaderBoardDto> studentResults) {
		this.title = title;
		this.totalAttempts = totalAttempts;
		this.averageScore = averageScore;
		this.studentResults = studentResults;
	}
	

}
