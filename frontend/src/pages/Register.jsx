import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'Student' // Default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/quiz/auth/register', formData);
            // alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (error) {
            console.error("Registration Error", error);
            // safe check for error message
            const errMsg = error.response?.data || error.message || "Unknown Error";
            alert("Registration Failed: " + errMsg);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">📝 Register</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Username */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input type="text" name="username" className="form-control" onChange={handleChange} required />
                    </div>
                    
                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>

                    {/* Role Selection */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">I am a...</label>
                        <select name="role" className="form-select" onChange={handleChange}>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success w-100 btn-lg rounded-pill">Register</button>
                </form>
                <p className="text-center mt-3">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;