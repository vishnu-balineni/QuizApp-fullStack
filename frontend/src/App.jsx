import React from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import AddQuiz from './pages/AddQuiz';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizAnalytics from './pages/QuizAnalytics';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Helper component to protect pages
const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user to decide what to show in Navbar
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper to handle Logo Click
  const handleLogoClick = () => {
      if (user && user.role === 'Teacher') {
          navigate("/admin"); // Teacher -> Dashboard
      } else {
          navigate("/");      // Student -> Home
      }
  };

  return (
    <div>
      {/* Show Navbar on all pages EXCEPT Login and Register */}
      {location.pathname !== '/login' && location.pathname !== '/register' && (
          <nav 
            className="navbar mb-0 py-4 shadow-sm" 
            style={{ 
                backgroundColor: '#6e6a6a48',
                borderBottom: '3px solid #646060ff',
            }}
          >
            <div className="container d-flex justify-content-between align-items-center">
              {/* Logo */}
              <span 
                className="navbar-brand mb-0 h1 fw-bold text-uppercase" 
                style={{
                  fontSize: '2rem',
                  background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', 
                  letterSpacing: '2px',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
                onClick={handleLogoClick} // <--- UPDATED: Smart Redirect
              >
                  Quiz App
              </span>

              {/* Navbar Buttons */}
              <div className="d-flex gap-3 align-items-center">
                
                {/* 1. Show "Create Quiz" ONLY if User is a TEACHER */}
                {user && user.role === 'Teacher' && (
                   <button 
                     className="btn btn-success fw-bold rounded-pill px-4"
                     onClick={() => navigate("/admin/create")} // <--- Goes to Create Page
                   >
                     + Create Quiz
                   </button>
                )}
                {/* --- NEW: STUDENT DASHBOARD BUTTON --- */}
                {user && user.role === 'Student' && (
                    <button 
                        className="btn btn-outline-primary fw-bold rounded-pill px-4"
                        onClick={() => navigate("/student-dashboard")}
                    >
                        📊 My Dashboard
                    </button>
                )};

                {/* 2. Show Logout Button if User is Logged In */}
                {user && (
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold text-dark d-none d-md-block" style={{fontSize: '1.2rem'}}>
                            Hi, {user.username}
                        </span>
                        <button 
                            className="btn btn-danger rounded-pill btn-sm px-3"
                            onClick={handleLogout}
                            style={{ fontWeight: 'bold' }}
                        >
                            Logout 
                        </button>
                    </div>
                )}
              </div>
            </div>
          </nav>
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Must be logged in) */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        
        {/* --- TEACHER ROUTES (FIXED) --- */}
        
        {/* 1. Main Link goes to Dashboard */}
        <Route path="/admin" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />

        {/* 2. Specific Link goes to Create Page */}
        <Route path="/admin/create" element={<PrivateRoute><AddQuiz /></PrivateRoute>} />
        
        {/* 3. Analytics Route */}
        <Route path="/admin/analytics/:quizId" element={<PrivateRoute><QuizAnalytics /></PrivateRoute>} />
        <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;