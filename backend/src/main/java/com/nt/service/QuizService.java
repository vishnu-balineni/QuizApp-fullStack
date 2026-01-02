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
	
	
	public Quiz createQuiz(QuizDto quizDto,Long teacherId) {
		User teacher = userRepo.findById(teacherId)
				.orElseThrow(()-> new ResourceNotFound("teacher does not exixts with id +  :"+ teacherId));
		
		Quiz quiz = new Quiz();
		quiz.setTitle(quizDto.getTitle());
		quiz.setCategory(quizDto.getCategory());
		quiz.setTimer(quizDto.getTimer());
		quiz.setTeacher(teacher);
		
		
		List<Question> questions = new ArrayList<>();
		
		for(QuestionDto qDto:quizDto.getQuestions()) {
			Question question = new Question();
			question.setQuestionText(qDto.getQuestionText());
			question.setOptions(qDto.getOptions());
			question.setCorrectAnswer(qDto.getCorrectMatch());
			
			
			question.setQuiz(quiz);
			questions.add(question);
		}
		quiz.setQuestions(questions);
		return quizRepo.save(quiz);
	}
	
	public List<Quiz> getQuizzesByCategory(String category){
		return quizRepo.findByCategory(category);
		
	}
	public List<Quiz> getQuizzes(String title){
		return quizRepo.findByTitleContainingIgnoreCase(title);
	}
	
	public Integer submitQuiz(Long quizId,Long studentId,List<String> userAnswers) {
		
		Quiz quiz = quizRepo.findById(quizId).orElseThrow(()->new ResourceNotFound("Quiz not found of id :"+quizId));
		
		User student = userRepo.findById(studentId).orElseThrow(()->new ResourceNotFound("Student not found of id  :"+ studentId));
		if (student.getRole() != com.nt.entity.Role.Student) {
	         throw new RuntimeException("Only Students can take quizzes!");
	    }
		
		List<Question> questions = quiz.getQuestions();
		int score =0 ;
		int limit = Math.min(questions.size(), userAnswers.size());
		for(int i =0;i<limit;i++) {
			String correctAns = questions.get(i).getCorrectAnswer();
			String userAns = userAnswers.get(i);
			
			if(userAns != null && userAns.equalsIgnoreCase(correctAns))score++;
		}
		
		QuizResult result = new QuizResult();
		result.setQuiz(quiz);
		result.setScore(score);
		result.setStudent(student);
		result.setTotalQuestions(questions.size());
		result.setAttemptedAt(java.time.LocalDateTime.now());
		
		quizResultRepo.save(result);
		
		
		
		return score;
		
	}
	public Integer getQuizAttempts(Long quizId) {
        return quizResultRepo.findByQuizId(quizId).size();
    }
	// Add this method to fetch a all quizzes
    public List<QuizSummaryDto> getAllQuizzes() {
        List<Quiz> quizzes = quizRepo.findAll();
        List<QuizSummaryDto>summary = new ArrayList<>();
        for(Quiz q:quizzes) {
        	summary.add(new QuizSummaryDto(q.getId(),q.getCategory(),q.getTitle()));
        }
        return summary;
    }
    // for showing the students who scored highest marks in the quiz
    public List<LeaderBoardDto> getLeaderBoard(Long quizId){
    	List<QuizResult> results = quizResultRepo.findTop10ByQuizIdOrderByScoreDesc(quizId);
    	
    	List<LeaderBoardDto> leaders = new ArrayList<>();
    	for(QuizResult qr:results) {
    		leaders.add(new LeaderBoardDto(qr.getStudent().getUsername(),qr.getScore()));
    	}
    	return leaders;
    }
    public Quiz getQuizById(Long quizId) {
    	return quizRepo.findById(quizId).orElseThrow(()->new ResourceNotFound("Quiz not found of id : "+ quizId));
    }
    
    // in teacher point of view it shows how may people wrote the test with their details 
    public TeacherDashBoardDto getTeacherDashBoard(Long quizId) {
    	
    	Quiz quiz = quizRepo.findById(quizId).orElseThrow(()->new ResourceNotFound("quiz not found of id : " + quizId));
    	
    	List<QuizResult> result = quizResultRepo.findByQuizIdOrderByScoreDesc(quizId);
    	int totalAttempts = result.size();
    	double totalScore =0 ;
    	List<LeaderBoardDto> studentList = new ArrayList<>();
    	for(QuizResult qr:result) {
    		totalScore +=qr.getScore();
    		
    		studentList.add(new LeaderBoardDto(qr.getStudent().getUsername(),qr.getScore()));
    		
    	}
    	double avg = (totalAttempts >0)?(totalScore/totalAttempts):0.0;
		return new TeacherDashBoardDto(quiz.getTitle(),totalAttempts,avg,studentList);
    	
    }
    // the student dashBoard that contains the recent quizzes of the student 
    public List<StudentDashBoardDto> getStudentDashBoardDto(Long studentId){
    	User student = userRepo.findById(studentId).orElseThrow(()->new ResourceNotFound("no student found with id :  "+studentId));
    	List<QuizResult> result = quizResultRepo.findByStudentIdOrderByAttemptedAtDesc(studentId);
    	List<StudentDashBoardDto> dashboard = new ArrayList<>();
    	for(QuizResult qr:result) {
    		if(qr.getQuiz()==null)continue;
    		dashboard.add(new StudentDashBoardDto(qr.getQuiz().getTitle(),qr.getScore(),qr.getTotalQuestions(),qr.getAttemptedAt()));
    	}
    	return dashboard;
    }
    
    public void deleteQuizById(Long quizId, Long requesterId) {
        Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // SAFETY CHECK: If the quiz has NO teacher, just delete it (it's an old orphan quiz)
        if (quiz.getTeacher() != null) {
            // If it HAS a teacher, check if IDs match
            if (!quiz.getTeacher().getId().equals(requesterId)) {
                 throw new RuntimeException("❌ Access Denied: You are not the creator.");
            }
        }
        
        // If we get here, it's safe to delete
        quizRepo.deleteById(quizId);
    }
    
    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        // Assuming you have a repository
        return quizRepo.findByTeacherId(teacherId);
    }
    

}
