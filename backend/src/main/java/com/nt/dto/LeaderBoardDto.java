package com.nt.dto;

import lombok.Data;

@Data
public class LeaderBoardDto {
	String username;
	Integer score;
	
	public LeaderBoardDto(String username,Integer score) {
		this.username = username;
		this.score = score;
	}

}
