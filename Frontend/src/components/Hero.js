import React, { useState, useRef} from 'react';
import axios from 'axios';
// import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

const API_URL = "http://127.0.0.1:8000"; // Your backend URL

// src/components/Hero.js

// ... (imports are the same) ...

const AuthForm = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // --- ADD NEW STATE FOR CONFIRM PASSWORD ---
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // --- ADD CLIENT-SIDE VALIDATION ---
    if (!isLoginView && password !== confirmPassword) {
      setError("Passwords do not match!");
      return; // Stop the submission
    }
    // You could add a password length check here too
    if (!isLoginView && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    // ------------------------------------

    const endpoint = isLoginView ? '/auth/login' : '/auth/signup';

    try {
      // Send only email and password to the backend
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      if (isLoginView) {
        onLogin(response.data.access_token);
      } else {
        alert('Signup successful! Please log in.');
        setIsLoginView(true);
      }
    } catch (err) {
      // ... (error handling logic remains the same) ...
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glow-block">
      <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleAuth}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        
        {/* --- ADD CONFIRM PASSWORD INPUT (only for signup) --- */}
        {!isLoginView && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
          />
        )}
        {/* -------------------------------------------------- */}

        <button type="submit">{isLoginView ? 'Login' : 'Sign Up'}</button>
      </form>
      {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
      <p>
        {/* ... (toggle between login/signup is the same) ... */}
      </p>
    </motion.div>
  );
};

// ... (The rest of the Hero.js component is the same) ...


const Tracker = ({ token }) => {
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset result on new file selection
    } else {
      setSelectedFile(null);
      setPreview(null);
      setError('Please select a valid image file (JPG, PNG, etc.).');
    }
  };

  const analyzePhoto = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setResult(response.data);
    } catch (err) {
      setError('Analysis failed. Your session might have expired. Please log out and log in again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glow-block" style={{width: '90%', maxWidth: '800px'}}>
      <h2>UV Exposure Analysis</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap'}}>
        
        {/* File Upload Area */}
        <div onClick={() => fileInputRef.current.click()} className="upload-area">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/jpg" 
          />
          <p>{preview ? 'Change Photo' : 'Click to Upload Photo'}</p>
        </div>
        
        {/* Image Preview and Analyze Button */}
        {preview && (
          <div>
            <h3>Your Photo</h3>
            <img src={preview} alt="Selected skin" style={{borderRadius: '10px', width: '100%', maxWidth: '300px'}} />
            <button onClick={analyzePhoto} disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Analyzing...' : 'Analyze My Skin'}
            </button>
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{marginTop: '2rem'}}>
          <h3>Analysis Result</h3>
          <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Prediction: <span style={{color: result.prediction === 'Tanned' ? 'orange' : 'lightblue'}}>{result.prediction}</span></p>
          <p style={{fontSize: '1.2rem'}}>Confidence: {result.confidence}</p>
        </motion.div>
      )}
    </motion.div>
  );
};


const Hero = ({ onLogin, isLoggedIn, token }) => {
  return (
    <section id="hero" className="section">
      {isLoggedIn ? <Tracker token={token} /> : <AuthForm onLogin={onLogin} />}
    </section>
  );
};

export default Hero;