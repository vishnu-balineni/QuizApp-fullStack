package com.nt.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
	private String message;
	private int statusCode;
	private LocalDateTime timestamp;
	
	public ErrorResponse(int statusCode,String message) {
		this.statusCode = statusCode;
		this.message = message;
		this.timestamp = LocalDateTime.now();
		
	}

}
