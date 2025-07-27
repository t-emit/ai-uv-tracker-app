import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import your components
import Navbar from '../components/Navbar';
import About from '../components/About';
import FAQ from '../components/FAQ';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// This is the Uploader component from your old Hero.js
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

const TrackerPage = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    navigate('/login'); // Redirect to login on logout
  };

  if (!token) {
    // Show a loading message or spinner while redirecting
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Navbar isLoggedIn={true} onLogout={handleLogout} />
      <main>
        <section id="hero" className="section">
          <Tracker token={token} />
        </section>
        <About />
        <FAQ />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
};

export default TrackerPage;