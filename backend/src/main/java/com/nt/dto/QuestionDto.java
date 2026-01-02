package com.nt.dto;

import java.util.List;

import lombok.Data;

@Data
public class QuestionDto {
	public String questionText;
	public List<String> options;
	public String correctMatch;

}
