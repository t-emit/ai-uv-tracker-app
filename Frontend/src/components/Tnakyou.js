import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Re-use the main styles

const ThankYou = () => {
  return (
    // This container centers the content on the page
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glow-block" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Thank You!</h1>
        <p style={{ fontSize: '1.2rem' }}>Your feedback has been submitted successfully.</p>
        <p>We appreciate you helping us improve.</p>
        
        {/* The Link component is the correct way to navigate in React Router */}
        <Link to="/">
          <button style={{ marginTop: '1.5rem' }}>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;