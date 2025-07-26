// src/components/Navbar.js
import React from 'react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      {/* The h1 is no longer wrapped */}
      <h1 className="navbar-title">AI UV Tracker</h1>
      
      <div className="navbar-links">
        <a href="#about">About</a>
        <a href="#faq">FAQ</a>
        <a href="#feedback">Feedback</a>
        {isLoggedIn && <button onClick={onLogout} className="logout-button">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;