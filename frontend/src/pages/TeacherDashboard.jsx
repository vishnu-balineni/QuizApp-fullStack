import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TeacherDashboard = () => {
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [stats, setStats] = useState({}); 
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchMyQuizzes = async () => {
            try {
                // Fetch Quizzes made by THIS teacher
                const response = await api.get(`/teacher/${user.id}`);
                setMyQuizzes(response.data);

                // Fetch Stats for each quiz
                const statsData = {};
                for (const quiz of response.data) {
                    try {
                        const statRes = await api.get(`/stats/${quiz.id}`);
                        statsData[quiz.id] = statRes.data;
                    } catch (e) {
                        statsData[quiz.id] = 0;
                    }
                }
                setStats(statsData);

            } catch (error) {
                console.error("Error loading dashboard", error);
            }
        };
        
        if (user && user.role === 'Teacher') {
            fetchMyQuizzes();
        }
    }, [user.id]);

    const handleDelete = async (quizId) => {
        // if(window.confirm("Are you sure you want to delete this quiz?")) {}
            try {
                await api.delete(`/delete/${quizId}?teacherId=${user.id}`);
                setMyQuizzes(myQuizzes.filter(q => q.id !== quizId));
            } catch (error) {
                alert("Failed to delete quiz");
            }
        
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">👨‍🏫 Teacher Dashboard</h2>
                <button className="btn btn-success rounded-pill fw-bold px-4" onClick={() => navigate("/admin/create")}>
                    + Create New Quiz
                </button>
            </div>

            <div className="row g-4">
                {myQuizzes.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <h4 className="text-muted">You haven't created any quizzes yet.</h4>
                        <p>Click the button above to get started!</p>
                    </div>
                ) : (
                    myQuizzes.map((quiz) => (
                        <div className="col-md-6 col-lg-4" key={quiz.id}>
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{quiz.title}</h5>
                                    <span className="badge bg-secondary mb-3">{quiz.category}</span>
                                    
                                    {/* STATS SECTION */}
                                    <div className="alert alert-light border d-flex justify-content-between align-items-center">
                                        <small className="text-muted">Attempts:</small>
                                        <span className="fw-bold fs-5 text-primary">
                                            👥 {stats[quiz.id] || 0}
                                        </span>
                                    </div>

                                    <div className="d-grid gap-2 mt-3">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/admin/analytics/${quiz.id}`)}
                                        >
                                            📊 View Analytics
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger" 
                                            onClick={() => handleDelete(quiz.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;