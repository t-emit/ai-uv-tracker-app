import React from 'react';
import { motion } from 'framer-motion';

const Feedback = () => {
  return (
    <section id="feedback" className="section">
      <motion.div 
        className="glow-block" 
        style={{width: '90%', maxWidth: '600px'}}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Feedback & Help</h2>
        <p>Have a question or suggestion? Let us know!</p>
        
        {/* This is the simple and correct form for redirecting with Web3Forms */}
        <form action="https://api.web3forms.com/submit" method="POST">
          
          {/* Your unique access key from your .env file */}
          <input type="hidden" name="access_key" value={process.env.REACT_APP_WEB3FORMS_ACCESS_KEY} />
          
          {/* This tells Web3Forms where to send the user after a successful submission */}
          <input type="hidden" name="redirect" value="http://localhost:3000/thank-you" />
          
          {/* Form fields for the user */}
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your message..." required></textarea>
          
          <button type="submit">Submit Form</button>
        </form>

      </motion.div>
    </section>
  );
};

export default Feedback;