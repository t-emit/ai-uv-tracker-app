import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import "./App.css"// We need the styles

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLoginSuccess = (authToken) => {
    localStorage.setItem('authToken', authToken);
    navigate('/tracker'); // Redirect to the tracker page on successful login
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLoginView && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!isLoginView && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const endpoint = isLoginView ? '/auth/login' : '/auth/signup';
  // --- START OF THE CHANGE ---
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
    if (isLoginView) {
      handleLoginSuccess(response.data.access_token);
    } else {
      // On successful signup, switch to the login view and show a message
      alert('Signup successful! Please log in.');
      setIsLoginView(true);
      // Clear form fields for login
      setPassword('');
      setConfirmPassword('');
    }
  } catch (err) {
    // This is the crucial part that was missing!
    if (err.response && err.response.data && err.response.data.detail) {
      // Use the specific error message from the FastAPI backend
      setError(err.response.data.detail);
    } else {
      // A generic fallback error message
      setError('An unknown error occurred. Please try again.');
    }
  }
  // --- END OF THE CHANGE ---
  };

  return (
    <div className="app-container" style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glow-block">
        <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {!isLoginView && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          )}
          <button type="submit">{isLoginView ? 'Login' : 'Sign Up'}</button>
        </form>
        {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button onClick={() => setIsLoginView(!isLoginView)} style={{ background: 'transparent', border: '1px solid var(--primary-color)', boxShadow: 'none' }}>
            {isLoginView ? 'Create Account' : 'Go to Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;