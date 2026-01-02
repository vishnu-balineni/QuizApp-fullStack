package com.nt.dto;

import lombok.Data;
import java.util.*;
@Data
public class QuizDto {
	public String title;
	public String category;
	public Integer timer;
	public List<QuestionDto> questions;

}
