package com.nt.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nt.dto.LeaderBoardDto;
import com.nt.dto.QuestionDto;
import com.nt.dto.QuizDto;
import com.nt.dto.QuizSummaryDto;
import com.nt.dto.StudentDashBoardDto;
import com.nt.dto.TeacherDashBoardDto;
import com.nt.entity.Question;
import com.nt.entity.Quiz;
import com.nt.entity.QuizResult;
import com.nt.entity.User;
import com.nt.entity.Role; // Added import for Role enum
import com.nt.exception.ResourceNotFound;
import com.nt.repository.QuizRepository;
import com.nt.repository.QuizResultRepository;
import com.nt.repository.UserRepository;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private QuizResultRepository quizResultRepo;
    
    public Quiz createQuiz(QuizDto quizDto, Long teacherId) {
        User teacher = userRepo.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFound("Teacher does not exist with id: " + teacherId));
        
        Quiz quiz = new Quiz();
        quiz.setTitle(quizDto.getTitle());
        quiz.setCategory(quizDto.getCategory());
        quiz.setTimer(quizDto.getTimer());
        quiz.setTeacher(teacher);
        
        List<Question> questions = new ArrayList<>();
        
        if (quizDto.getQuestions() != null) {
            for (QuestionDto qDto : quizDto.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(qDto.getQuestionText());
                
                // Ensure options are not null before setting
                List<String> options = qDto.getOptions() != null ? qDto.getOptions() : new ArrayList<>();
                question.setOptions(options);
                
                // Using getCorrectMatch as per your DTO structure
                question.setCorrectAnswer(qDto.getCorrectMatch());
                
                question.setQuiz(quiz);
                questions.add(question);
            }
        }
        
        quiz.setQuestions(questions);
        return quizRepo.save(quiz);
    }
    
    public Integer submitQuiz(Long quizId, Long studentId, List<String> userAnswers) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new ResourceNotFound("Quiz not found with id: " + quizId));
        
        User user = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFound("User not found with id: " + studentId));

        // FIX: Allow both Students and Teachers to submit for easier testing/development
        if (user.getRole() != Role.Student && user.getRole() != Role.Teacher) {
             throw new RuntimeException("Access Denied: Only Students or Teachers can submit quizzes!");
        }
        
        List<Question> questions = quiz.getQuestions();
        int score = 0;
        
        // Use the smaller of the two sizes to avoid IndexOutOfBounds
        int limit = Math.min(questions.size(), userAnswers.size());
        
        for (int i = 0; i < limit; i++) {
            String correctAns = questions.get(i).getCorrectAnswer();
            String userAns = userAnswers.get(i);
            
            // Basic check: handle null and ignore case
            if (userAns != null && correctAns != null && userAns.equalsIgnoreCase(correctAns)) {
                score++;
            }
        }
        
        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setScore(score);
        result.setStudent(user);
        result.setTotalQuestions(questions.size());
        result.setAttemptedAt(java.time.LocalDateTime.now());
        
        quizResultRepo.save(result);
        
        return score;
    }

    public List<QuizSummaryDto> getAllQuizzes() {
        List<Quiz> quizzes = quizRepo.findAll();
        List<QuizSummaryDto> summary = new ArrayList<>();
        for (Quiz q : quizzes) {
            summary.add(new QuizSummaryDto(q.getId(), q.getCategory(), q.getTitle()));
        }
        return summary;
    }

    public List<LeaderBoardDto> getLeaderBoard(Long quizId) {
        List<QuizResult> results = quizResultRepo.findTop10ByQuizIdOrderByScoreDesc(quizId);
        List<LeaderBoardDto> leaders = new ArrayList<>();
        for (QuizResult qr : results) {
            leaders.add(new LeaderBoardDto(qr.getStudent().getUsername(), qr.getScore()));
        }
        return leaders;
    }

    public Quiz getQuizById(Long quizId) {
        return quizRepo.findById(quizId)
                .orElseThrow(() -> new ResourceNotFound("Quiz not found with id: " + quizId));
    }
    
    public TeacherDashBoardDto getTeacherDashBoard(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new ResourceNotFound("Quiz not found with id: " + quizId));
        
        List<QuizResult> result = quizResultRepo.findByQuizIdOrderByScoreDesc(quizId);
        int totalAttempts = result.size();
        double totalScore = 0;
        List<LeaderBoardDto> studentList = new ArrayList<>();
        
        for (QuizResult qr : result) {
            totalScore += qr.getScore();
            studentList.add(new LeaderBoardDto(qr.getStudent().getUsername(), qr.getScore()));
        }
        
        double avg = (totalAttempts > 0) ? (totalScore / totalAttempts) : 0.0;
        return new TeacherDashBoardDto(quiz.getTitle(), totalAttempts, avg, studentList);
    }

    public List<StudentDashBoardDto> getStudentDashBoardDto(Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFound("No user found with id: " + studentId));
        
        List<QuizResult> result = quizResultRepo.findByStudentIdOrderByAttemptedAtDesc(studentId);
        List<StudentDashBoardDto> dashboard = new ArrayList<>();
        
        for (QuizResult qr : result) {
            if (qr.getQuiz() == null) continue;
            dashboard.add(new StudentDashBoardDto(qr.getQuiz().getTitle(), qr.getScore(), qr.getTotalQuestions(), qr.getAttemptedAt()));
        }
        return dashboard;
    }
    
    public void deleteQuizById(Long quizId, Long requesterId) {
        Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (quiz.getTeacher() != null) {
            if (!quiz.getTeacher().getId().equals(requesterId)) {
                 throw new RuntimeException("❌ Access Denied: You are not the creator.");
            }
        }
        quizRepo.deleteById(quizId);
    }
    
    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        return quizRepo.findByTeacherId(teacherId);
    }

    public List<Quiz> getQuizzesByCategory(String category) {
        return quizRepo.findByCategory(category);
    }

    public List<Quiz> getQuizzes(String title) {
        return quizRepo.findByTitleContainingIgnoreCase(title);
    }

    public Integer getQuizAttempts(Long quizId) {
        return quizResultRepo.findByQuizId(quizId).size();
    }
}