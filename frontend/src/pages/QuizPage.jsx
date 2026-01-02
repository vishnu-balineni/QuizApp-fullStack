import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './QuizPage.css';

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [score, setScore] = useState(null);
    const [answers, setAnswers] = useState({});
    
    // Feature States
    const [showReview, setShowReview] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]); 
    const [showLeaderboard, setShowLeaderboard] = useState(false); 

    const [timeleft, setTimeLeft] = useState(null); 
    const timerRef = useRef(null);

    useEffect(() => {
        const FetchQuiz = async () => {
            try {
                const response = await api.get(`/fetch/${id}`);
                setQuiz(response.data);
                const initialTime = (response.data.timer || 10) * 60;
                setTimeLeft(initialTime);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        FetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeleft === null || score !== null) return;
        if (timeleft === 0) {
            handleSubmit();
            return;
        }
        timerRef.current = setTimeout(() => {
            setTimeLeft(timeleft - 1);
        }, 1000);
        return () => clearTimeout(timerRef.current);
    }, [timeleft, score]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        clearTimeout(timerRef.current);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const studentId = user ? user.id : null;

            if (!studentId) {
                alert("Error: User not found. Please login again.");
                navigate('/login');
                return;
            }

            const answerList = quiz.questions.map((_, index) => answers[index] || null);
            
            const response = await api.post(`/submit/${id}?studentId=${studentId}`, answerList);

            let finalScore = 0;
            if (response.data && response.data.score !== undefined) {
                finalScore = response.data.score;
            } else if (typeof response.data === 'number') {
                finalScore = response.data;
            } else {
                const matches = String(response.data).match(/(\d+)/);
                finalScore = matches ? parseInt(matches[0], 10) : 0;
            }
            
            setScore(finalScore);
            fetchLeaderboard(); 

        } catch (error) {
            console.error("Error in submitting quiz:", error);
            alert("Submission failed. Please try again.");
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`/leaderboard/${id}`);
            setLeaderboard(response.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    if (!quiz) return <div className="text-center mt-5">Loading quiz...</div>;

    return (
        <div className="container mt-5 mb-5">
            {score !== null ? (
                <div className="text-center mt-5">
                    <div className="card shadow-lg mx-auto" style={{ maxWidth: '600px', borderRadius: '20px', overflow: 'hidden' }}>
                        
                        <div className={`card-header py-4 ${score >= quiz.questions.length / 2 ? 'bg-success' : 'bg-danger'} text-white`}>
                            <h2 className="mb-0 fw-bold">
                                {score >= quiz.questions.length / 2 ? '🎉 Awesome Job!' : '📚 Keep Learning!'}
                            </h2>
                        </div>

                        <div className="card-body p-5">
                            <h1 className="display-1 fw-bold text-dark mb-3">
                                {score} <span className="text-muted fs-4">/ {quiz.questions.length}</span>
                            </h1>

                            <span className="badge bg-warning text-dark fs-5 px-4 py-2 rounded-pill mb-4">
                                {Math.round((score / quiz.questions.length) * 100)}% Score
                            </span>

                            <div className="d-grid gap-2 mb-4">
                                <button onClick={() => setShowReview(!showReview)} className="btn btn-outline-dark btn-lg rounded-pill">
                                    {showReview ? '🙈 Hide Answers' : '📝 Review Answers'}
                                </button>

                                <button onClick={() => setShowLeaderboard(!showLeaderboard)} className="btn btn-warning btn-lg rounded-pill fw-bold">
                                    {showLeaderboard ? '🙈 Hide Ranks' : '🏆 View Leaderboard'}
                                </button>
                                
                                <button onClick={() => window.location.reload()} className="btn btn-primary btn-lg rounded-pill">🔄 Try Again</button>
                                <a href="/" className="btn btn-outline-primary btn-lg rounded-pill">🏠 Back to Home</a>
                            </div>

                            {/* --- LEADERBOARD SECTION --- */}
                            {showLeaderboard && (
                                <div className="mt-4">
                                    <h4 className="fw-bold mb-3">🏆 Top Performers</h4>
                                    <ul className="list-group">
                                        {leaderboard.map((entry, index) => (
                                            <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${index === 0 ? 'bg-warning bg-opacity-25' : ''}`}>
                                                <span>
                                                    <span className="fw-bold me-2">#{index + 1}</span> 
                                                    <b>{entry.username}</b>
                                                    {JSON.parse(localStorage.getItem("user"))?.username === entry.username && <span className="badge bg-primary ms-2">You</span>}
                                                </span>
                                                <span className="fw-bold">{entry.score} pts</span>
                                            </li>
                                        ))}
                                        {leaderboard.length === 0 && <p className="text-muted">No records yet.</p>}
                                    </ul>
                                </div>
                            )}

                            {/* --- REVIEW SECTION (FIXED) --- */}
                            {showReview && (
                                <div className="text-start mt-4">
                                    <h4 className="text-center mb-3">📝 Answer Key</h4>
                                    {quiz.questions.map((q, index) => {
                                        const userAnswer = answers[index];
                                        
                                        // --- THE FIX IS HERE ---
                                        // We check BOTH names so it works regardless of backend naming
                                        const actualAnswer = q.correctAnswer || q.correctMatch; 

                                        const isCorrect = userAnswer === actualAnswer;
                                        const isSkipped = !userAnswer;

                                        return (
                                            <div key={q.id} className={`card mb-3 p-3 border-2 ${isCorrect ? 'border-success' : 'border-danger'}`} style={{ backgroundColor: isCorrect ? '#f0fff4' : '#fff5f5' }}>
                                                <p className="fw-bold mb-2">Q{index + 1}: {q.questionText}</p>
                                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                                    <div className="p-2 rounded w-100" style={{border: '1px solid #ccc', background: 'white'}}>
                                                        <small className="text-muted d-block mb-1">Your Answer:</small>
                                                        {isSkipped ? <span className="badge bg-secondary">⛔ Skipped</span> : <strong className={isCorrect ? 'text-success' : 'text-danger'}>{userAnswer} {isCorrect ? '✅' : '❌'}</strong>}
                                                    </div>
                                                    {(!isCorrect || isSkipped) && (
                                                        <div className="p-2 rounded w-100" style={{border: '1px solid #198754', background: '#e8f5e9'}}>
                                                            <small className="text-muted d-block mb-1">Correct Answer:</small>
                                                            <strong className="text-success">{actualAnswer} ✅</strong>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <div className="quiz-container">
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h2 style={{ color: "#030303" }}>{quiz.title}</h2>
                        <div className={`card p-2 px-4 fw-bold shadow-sm ${timeleft < 60 ? 'bg-danger text-white' : 'bg-light text-dark'}`} style={{ fontSize: '1.5rem', borderRadius: '50px' }}>
                            ⏳ {timeleft !== null ? formatTime(timeleft) : "Loading..."}
                        </div>
                    </div>
                    {quiz.questions.map((q, index) => (
                        <div key={q.id} className="question-card">
                            <p className="question-text">{index + 1}. {q.questionText}</p>
                            <div className="options-grid">
                                {q.options.map((option, optIndex) => {
                                    const uniqueId = `q${index}-opt${optIndex}`;
                                    
                                    return (
                                        <div key={optIndex} className="form-check p-2">
                                            <input 
                                                className="form-check-input option-input" 
                                                type="radio" 
                                                name={`question-${index}`} 
                                                id={uniqueId}
                                                value={option} 
                                                onChange={() => handleOptionSelect(index, option)} 
                                                checked={answers[index] === option} 
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label 
                                                className="form-check-label option-label w-100" 
                                                htmlFor={uniqueId}
                                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            >
                                                {option}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <button style={{ borderRadius: "50px", fontWeight: "bold" }} className="btn btn-success btn-lg w-100 mt-4" onClick={handleSubmit}>Submit Quiz</button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;