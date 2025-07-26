import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  { q: "Is this a medical diagnosis?", a: "Absolutely not. This is an educational AI tool for entertainment and awareness. Always consult a dermatologist for any health concerns." },
  { q: "How accurate is the AI?", a: "Our model is trained on a diverse dataset for high accuracy, but results can vary based on lighting, camera quality, and skin tone. It's a suggestion, not a certainty." },
  { q: "Is my data safe?", a: "Yes. We prioritize your privacy. Your login is encrypted, and while a record of your prediction is saved for your history, the images themselves are not stored permanently on our servers after analysis." },
  { q: "What kind of photo should I take?", a: "For best results, use a clear, well-lit photo of your skin. Avoid strong shadows, filters, and make sure the area of skin is clearly visible." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section">
      <h2>Frequently Asked Questions</h2>
      <div>
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              {item.q}
              <span>{openIndex === index ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="faq-answer">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;