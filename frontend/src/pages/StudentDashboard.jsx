import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/student-dashboard/${user.id}`);
                setAttempts(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchHistory();
    }, [user.id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="text-center mt-5">Loading your history...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold text-primary">👤 My Learning Dashboard</h2>
            
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">📜 Quiz History</h5>
                </div>
                <div className="card-body p-0" style={{border: '2px solid #a4cbf1ff'}}>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Quiz Title</th>
                                    <th>Date Taken</th>
                                    <th>Score</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.length > 0 ? (
                                    attempts.map((attempt, index) => {
                                        const percentage = (attempt.score / attempt.totalQuestions) * 100;
                                        const isPass = percentage >= 50; // Simple pass logic

                                        return (
                                            <tr key={index}>
                                                <td className="ps-4 fw-bold text-dark">{attempt.quizTitle}</td>
                                                <td className="text-muted">{formatDate(attempt.attemptedAt)}</td>
                                                <td>
                                                    <span className="badge bg-primary rounded-pill px-3">
                                                        {attempt.score} / {attempt.totalQuestions}
                                                    </span>
                                                </td>
                                                <td>
                                                    {isPass ? (
                                                        <span className="text-success fw-bold">Pass ✅</span>
                                                    ) : (
                                                        <span className="text-danger fw-bold">Fail ❌</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            You haven't taken any quizzes yet. <br/>
                                            <button className="btn btn-link" onClick={() => navigate('/')}>Go take one!</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;