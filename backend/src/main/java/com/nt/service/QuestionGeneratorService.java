package com.nt.service;

import com.nt.dto.QuestionDto;
import com.nt.dto.QuizDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class QuestionGeneratorService {

    @Autowired
    private RestTemplate restTemplate;

    // 1. Update the method to accept 'amount'
    public QuizDto generateQuizFromApi(String title, int amount) {
        
        // 2. Build the URL dynamically using the amount
        // Limit the amount to max 50 (API limit) just in case
        if (amount > 50) amount = 50;
        if (amount < 1) amount = 1;

        String dynamicUrl = "https://opentdb.com/api.php?amount=" + amount + "&category=18&type=multiple";

        // 3. Call API
        ResponseEntity<Map> response = restTemplate.getForEntity(dynamicUrl, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null) throw new RuntimeException("API returned no data");

        List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

        QuizDto quizDto = new QuizDto();
        quizDto.setTitle(title);
        quizDto.setCategory("Computer Science");

        List<QuestionDto> questions = new ArrayList<>();

        if (results != null) {
            for (Map<String, Object> item : results) {
                QuestionDto q = new QuestionDto();
                q.setQuestionText((String) item.get("question"));
                String correctAnswer = (String) item.get("correct_answer");
                q.setCorrectMatch(correctAnswer);

                List<String> options = (List<String>) item.get("incorrect_answers");
                options.add(correctAnswer);
                q.setOptions(options);

                questions.add(q);
            }
        }
        quizDto.setQuestions(questions);
        return quizDto;
    }
}