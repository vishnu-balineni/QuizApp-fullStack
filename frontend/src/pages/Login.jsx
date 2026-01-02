import react from 'react';
import {useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';


const Login=()=>{
    const navigate = useNavigate();

    const [formData,setFormData]=useState({
        username:'',
        password:''
    });
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});

    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Updated path to match @RequestMapping("/api/quiz/auth")
        const response = await api.post('/auth/login', formData);
        const user = response.data;
        
        localStorage.setItem("user", JSON.stringify(user));

        // Use toUpperCase() to match Java Enums (TEACHER/STUDENT)
        const role = user.role.toUpperCase();

        if (role === 'TEACHER') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid Username or Password");
    }
};
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">🔐 Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input type="text" name="username" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill">Login</button>
                </form>
                <p className="text-center mt-3">
                    New user? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}


export default Login;