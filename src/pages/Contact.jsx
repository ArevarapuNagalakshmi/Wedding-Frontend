import React, { useState } from "react";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess("✓ Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-content">
        {/* Left Section - Info */}
        <div className="contact-info-section">
          <div className="info-header">
            <h2>Get In Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h4>Address</h4>
              <p>123 Wedding Street, Event City, EC 12345</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h4>Email</h4>
              <p>hello@weddingservices.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h4>Hours</h4>
              <p>Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            {success && <div className="contact-success">{success}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={errors.subject ? "error" : ""}
              />
              {errors.subject && <span className="error-msg">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="5"
                className={errors.message ? "error" : ""}
              />
              {errors.message && <span className="error-msg">{errors.message}</span>}
            </div>

            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
