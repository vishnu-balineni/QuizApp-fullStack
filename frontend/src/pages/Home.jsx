import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Home.css'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // <--- 1. Search State
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await api.get('/all-quizzes'); // Make sure this matches your Controller
                setQuizzes(response.data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        fetchQuizzes();
    }, []);

    // 2. Filter Logic: Search by Title or Category
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <div className="container mt-5">
                
                {/* --- SEARCH BAR SECTION --- */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-8">
                        <div className="input-group input-group-lg shadow-sm">
                            <span className="input-group-text bg-white border-end-0">🔍</span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                placeholder="Search for a quiz (e.g. Java, Science)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <h2 className="text-center page-title mb-4">Available Quizzes</h2>
                
                <div className="row g-4"> 
                    {/* Use filteredQuizzes instead of quizzes */}
                    {filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map((quiz) => (
                            <div className="col-lg-4 col-md-6 col-12" key={quiz.id}>
                                <div className="card h-100 quiz-card p-3 shadow-sm border-0 hover-card">
                                    <div className="card-body d-flex flex-column text-center align-items-center">
                                        
                                        <div className="mb-3" style={{fontSize: '3rem'}}>
                                            📚
                                        </div>

                                        <h5 className="card-title fs-4 mb-2 fw-bold">{quiz.title}</h5>
                                        
                                        <div className="mb-3">
                                            <span className="badge bg-info text-dark rounded-pill px-3 py-2">
                                                {quiz.category}
                                            </span>
                                        </div>

                                        <p className="card-text text-muted flex-grow-1 small">
                                            Challenge yourself with our {quiz.category} questions. 
                                            Can you score 100%?
                                        </p>
                                        
                                        <button className="btn btn-primary w-100 rounded-pill mt-auto fw-bold py-2"
                                            onClick ={()=>navigate(`/quiz/${quiz.id}`)}>
                                            Start Quiz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted py-5">
                            <h4>😕 No quizzes found matching "{searchTerm}"</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;