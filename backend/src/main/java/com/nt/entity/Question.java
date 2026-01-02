package com.nt.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty; // Added this
import java.util.List;

@Entity
@Data
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_value") 
    private List<String> options; 

    // This ensures the Backend, DTO, and Frontend all speak the same language
    @JsonProperty("correctMatch") 
    @Column(name="correct_match")
    private String correctAnswer; 

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonIgnore        
    @ToString.Exclude  
    private Quiz quiz;
}