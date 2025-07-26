import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { motion } from 'framer-motion';

// FINAL CODE: After verifying the URL in your browser, these paths will work.
// Make sure the case ('Before.jpg' vs 'before.jpg') matches your actual file names.
const beforeImageURL = "/images/tan.jpg"; // Using lowercase as an example
const afterImageURL = "/images/fair.jpg";  // Using lowercase as an example

const About = () => {
  return (
    <section id="about" className="section">
      <motion.div 
        className="about-me-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>How It Works</h2>
        <p className="about-me-text">
          Our AI uses a sophisticated Convolutional Neural Network (CNN), a type of deep learning model, trained on thousands of skin images. It learns to identify subtle patterns, textures, and color shifts associated with sun exposure. When you upload a photo, the AI analyzes these features to provide a prediction on whether your skin shows signs of tanning.
        </p>

        {/* This div provides a stable container for the component */}
        <div className="image-slider-container">
          <ReactCompareImage leftImage={beforeImageURL} rightImage={afterImageURL} />
        </div>
        
        <p>Drag the slider to see the difference our AI looks for!</p>
      </motion.div>
    </section>
  );
};

export default About;