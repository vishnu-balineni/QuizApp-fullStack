import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AddQuiz = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [timer, setTimer] = useState(10); 
    const [questions, setQuestions] = useState([{
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
    }]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], questionText: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[qIndex] };
        const updatedOptions = [...updatedQuestion.options];
        updatedOptions[oIndex] = value;
        updatedQuestion.options = updatedOptions;
        newQuestions[qIndex] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = { ...newQuestions[qIndex], correctAnswer: value };
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked..."); // DEBUG LOG 1

        // 1. GET REAL USER ID
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            alert("You are not logged in! Please login again.");
            navigate('/login');
            return;
        }

        // 2. MANUAL VALIDATION (So you know what's missing)
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText) {
                alert(`Please enter text for Question ${i + 1}`);
                return;
            }
            if (!questions[i].correctAnswer) {
                alert(`Please select a Correct Answer for Question ${i + 1}`);
                return; // Stops here if missing!
            }
        }

        const quizData = {
            title: title,
            category: category,
            timer: parseInt(timer),
            questions: questions
        };

        try {
            console.log("Sending to Backend:", quizData); // DEBUG LOG 2
            
            // 3. USE DYNAMIC TEACHER ID
            // Make sure your backend endpoint is actually /create
            // If your controller has @RequestMapping("/api/quiz"), this becomes /api/quiz/create
            await api.post(`/create?teacherId=${user.id}`, quizData);
            
            alert("Quiz Created Successfully! 🎉");
            navigate('/admin'); // Redirect to Dashboard
            
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Failed to create quiz. Check console for details.");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4">🛠️ Create a New Quiz</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="card p-4 mb-4 shadow-sm">
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Quiz Title</label>
                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Category</label>
                            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Time Limit (Minutes)</label>
                            <input 
                                type="number" 
                                className="form-control border-danger fw-bold text-danger" 
                                value={timer} 
                                onChange={(e) => setTimer(e.target.value)} 
                                min="1" 
                                required 
                            />
                        </div>
                    </div>
                </div>

                {questions.map((q, qIndex) => (
                    <div className="card p-4 mb-3 shadow-sm border-start border-4 border-primary" key={qIndex}>
                        <div className="d-flex justify-content-between">
                            <h5>Question {qIndex + 1}</h5>
                            {questions.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qIndex)}>🗑️ Remove</button>
                            )}
                        </div>
                        <input type="text" className="form-control mb-3" placeholder="Question Text" value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required />
                        
                        <div className="row">
                            {q.options.map((opt, oIndex) => (
                                <div className="col-md-6 mb-2" key={oIndex}>
                                    <input type="text" className="form-control" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required />
                                </div>
                            ))}
                        </div>

                        {/* CRITICAL: Ensure this is selected */}
                        <div className="mt-2">
                            <label className="form-label text-muted">Correct Answer:</label>
                            <select 
                                className="form-select" 
                                value={q.correctAnswer} 
                                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)} 
                                required
                            >
                                <option value="">Select correct option...</option>
                                {q.options.map((opt, i) => (
                                    opt && <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}

                <div className="d-grid gap-2">
                    <button type="button" className="btn btn-outline-primary" onClick={addQuestion}>+ Add Another Question</button>
                    {/* Ensure type="submit" */}
                    <button type="submit" className="btn btn-success btn-lg">🚀 Publish Quiz</button>
                </div>
            </form>
        </div>
    );
};

export default AddQuiz;