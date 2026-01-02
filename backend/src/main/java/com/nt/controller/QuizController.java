package com.nt.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nt.dto.*;
import com.nt.entity.Quiz;
import com.nt.service.QuestionGeneratorService;
import com.nt.service.QuizService;

@RestController
@RequestMapping("/api/quiz")

public class QuizController {

    @Autowired
    private QuestionGeneratorService generatorService;
    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody QuizDto quizDto, @RequestParam Long teacherId){
        try {
            Quiz createdQuiz = quizService.createQuiz(quizDto, teacherId);
            return ResponseEntity.ok("Quiz created successfully! ID: " + createdQuiz.getId());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FIX 4: Changed "/all" to "/all-quizzes" to match Home.jsx
    @GetMapping("/all-quizzes") 
    public ResponseEntity<List<QuizSummaryDto>> getAllQuizzes(){
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    // FIX 5: Added missing endpoint for Teacher Dashboard
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Quiz>> getQuizzesByTeacher(@PathVariable Long teacherId){
        // Assuming your service has a method for this. 
        // If not, you might need to add: quizRepository.findByTeacherId(teacherId);
        // For now, filtering all quizzes (Optimized approach recommended later)
        try {
             // You need to ensure quizService.getQuizzesByTeacher(teacherId) exists
             // If not, use repository directly or add method to service
             return ResponseEntity.ok(quizService.getQuizzesByTeacher(teacherId)); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/fetch/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        try {
            return ResponseEntity.ok(quizService.getQuizById(quizId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/submit/{quizId}")
    public ResponseEntity<String> submitQuiz(@PathVariable Long quizId, @RequestParam Long studentId, 
                                            @RequestBody List<String> answers) {
        try {
            Integer score = quizService.submitQuiz(quizId, studentId, answers);
            return ResponseEntity.ok(String.valueOf(score)); // Return score as String
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/leaderboard/{quizId}")
    public ResponseEntity<List<LeaderBoardDto>> getLeaderBoard(@PathVariable Long quizId){
        return ResponseEntity.ok(quizService.getLeaderBoard(quizId));
    }

    @GetMapping("/teacher-dashboard/{quizId}")
    public ResponseEntity<TeacherDashBoardDto> teacherDashBoard(@PathVariable Long quizId){
        return ResponseEntity.ok(quizService.getTeacherDashBoard(quizId));
    }
    
    // Deleting Quiz
    @DeleteMapping("/delete/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long quizId, @RequestParam(required = false) Long teacherId) {
        try {
            // Pass teacherId if your service requires check, otherwise just ID
            quizService.deleteQuizById(quizId, teacherId); 
            return ResponseEntity.ok("Quiz deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quiz not found.");
        }
    }
// Add this to QuizController.java
    
    @GetMapping("/stats/{quizId}")
    public ResponseEntity<Integer> getQuizStats(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizAttempts(quizId));
    }
    
    // Keep search/generate endpoints if needed...
    
    @GetMapping("/student-dashboard/{studentId}")
    public ResponseEntity<List<StudentDashBoardDto>> getStudentDashboard(@PathVariable Long studentId){
        try {
            return ResponseEntity.ok(quizService.getStudentDashBoardDto(studentId));
        } catch(Exception e) {
            e.printStackTrace(); // This will print errors to the console if they happen
            return ResponseEntity.internalServerError().build();
        }
    }
}