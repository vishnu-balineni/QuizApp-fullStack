package com.nt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSummaryDto {
	
	private Long id;
	private String title;
	private String category;
	
	public QuizSummaryDto(String category,Long id ,String title) {
		this.category = category;
		this.id = id ;
		this.title = title;
	}

}
