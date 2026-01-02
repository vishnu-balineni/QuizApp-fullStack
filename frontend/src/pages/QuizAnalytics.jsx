import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QuizAnalytics = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(`/teacher-dashboard/${quizId}`);
                console.log("Analytics Data:", response.data); // Debug to see exact names
                setData(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                alert("Could not load analytics.");
            }
        };
        fetchStats();
    }, [quizId]);

    if (!data) return <div className="text-center mt-5">Loading Analytics...</div>;

    return (
        <div className="container mt-5">
            <button style={{}}
            className="btn btn-primary mb-4" onClick={() => navigate('/admin')}>
                ← Back to Dashboard
            </button>

            {/* HEADER CARD */}
            <div className="card shadow-lg  mb-5" style={{borderRadius: '15px',border:'5px solid #abc0dfff    '}}>
                <div className="card-body p-5 text-center">
                    {/* FIX 1: Changed quizTitle -> title */}
                    <h2 className="display-5 fw-bold text-primary mb-2">{data.title}</h2>
                    <p className="text-muted" style={{fontWeight: 'bold'}}> Performance Report</p>

                    <div className="row mt-5">
                        {/* Metric 1: Total Attempts */}
                        <div className="col-md-6 border-end">
                            <h1 className="display-4 fw-bold">{data.totalAttempts}</h1>
                            <p className="text-uppercase text-muted fw-bold small">Total Students</p>
                        </div>
                        {/* Metric 2: Average Score */}
                        <div className="col-md-6">
                            {/* FIX 2: Changed avgScore -> averageScore */}
                            <h1 className="display-4 fw-bold text-success">
                                {data.averageScore ? data.averageScore.toFixed(1) : 0}
                            </h1>
                            <p className="text-uppercase text-muted fw-bold small">Average Score</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEADERBOARD TABLE */}
            <h4 className="fw-bold mb-3" style={{border: '2px solid #0b0e11ff',borderRadius: '10px'}}>📄 Student Details</h4>
            <div className="card shadow-sm " style={{border: '3px solid #37557eff',borderRadius: 'px'}}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 ps-4">Rank</th>
                                <th className="py-3">Student Name</th>
                                <th className="py-3">Score</th>
                                <th className="py-3">Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* FIX 3: Changed studentList -> studentResults AND added safety check (?.) */}
                            {data.studentResults?.map((student, index) => (
                                <tr key={index}>
                                    <td className="ps-4 text-muted">#{index + 1}</td>
                                    <td className="fw-bold">{student.username}</td>
                                    <td>
                                        <span className="badge bg-primary rounded-pill px-3">
                                            {student.score} pts
                                        </span>
                                    </td>
                                    <td>
                                        {/* FIX 4: Use averageScore here too */}
                                        {student.score >= data.averageScore ? (
                                            <span className="text-success fw-bold">User performed well 📈</span>
                                        ) : (
                                            <span className="text-warning fw-bold">Needs improvement ⚠️</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            
                            {(!data.studentResults || data.studentResults.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        No students have taken this quiz yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuizAnalytics;