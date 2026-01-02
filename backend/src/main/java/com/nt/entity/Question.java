package com.nt.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Data
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    // FIX 1: Add FetchType.EAGER to stop the 500 Error
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_value")
    private List<String> options; 

    // FIX 2: Rename this to match React's "correctAnswer"
    @Column(name="correct_match")
    private String correctAnswer; 

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonIgnore        // <--- Prevents Infinite Loop
    @ToString.Exclude  // <--- Prevents Console Crash
    private Quiz quiz;
}