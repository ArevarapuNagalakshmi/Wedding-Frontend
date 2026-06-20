import React, { useState } from "react";
import "../styles/Contact.css";

const Contact = () => {
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Message sent successfully!");
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">

        <h2>Contact Us</h2>

        {success && <div className="contact-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="4" placeholder="Your Message" required />

          <button type="submit" className="send-btn">
            <span className="btn-icon">📩</span>
            <span>Send Message</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
