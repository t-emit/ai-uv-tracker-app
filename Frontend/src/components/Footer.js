import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#about">About</a> | <a href="#faq">FAQ</a> | <a href="#feedback">Feedback</a>
      </div>
      <a href="mailto:talatsiddiqui028@gmail.com" className="footer-email">
        <FaEnvelope />
      </a>
      <p style={{marginTop: '1rem', fontSize: '0.8rem', color: '#888'}}>
        © {new Date().getFullYear()} AI UV Tracker. All Rights Reserved. Not for medical use.
      </p>
    </footer>
  );
};

export default Footer;