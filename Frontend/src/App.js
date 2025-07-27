import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';

// Import all your components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FAQ from './components/FAQ';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import LoginPage from './LoginPage';  
import TrackerPage from './TrackerPage';
import ThankYou from './components/Tnakyou'; // Make sure this path is correct

// Import your main CSS file
import './App.css';

// --- This new component holds the content of your main landing page ---
const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  // Check for an existing token in localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle successful login
  const handleLogin = (authToken) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        <Hero onLogin={handleLogin} isLoggedIn={isLoggedIn} token={token} />
        <About />
        <FAQ />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
};

// --- This is now your main App component, which only handles routing ---
function App() {
  return (
    <Router>
      <Routes>
        {/* The login page is now at the '/login' route */}
        <Route path="/login" element={<LoginPage />} />

        {/* The main tracker page is now at the '/tracker' route */}
        <Route path="/tracker" element={<TrackerPage />} />

        {/* The thank you page */}
        <Route path="/thank-you" element={<ThankYou />} />
        
        {/* Default route: redirect to login if not logged in, or tracker if logged in */}
        <Route 
          path="/" 
          element={localStorage.getItem('authToken') ? <Navigate to="/tracker" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;