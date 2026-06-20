import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">💍 Wedding Services</h2>

          <p className="footer-description">
            Connecting customers with trusted wedding vendors.
            Book photographers, venues, decorators, and more easily.
          </p>

          <div className="footer-socials">
            <span>🌐</span>
            <span>📘</span>
            <span>📷</span>
            <span>🐦</span>
          </div>
        </div>


        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>

          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>


        {/* Services */}
        <div className="footer-section">
          <h3 className="footer-title">Services</h3>

          <ul>
            <li>Photography</li>
            <li>Decoration</li>
            <li>Venues</li>
            <li>Catering</li>
            <li>Event Planning</li>
          </ul>
        </div>


        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>

          <p>📧 support@wedding.com</p>
          <p>📞 +91 9876543210</p>
          <p>📍 India</p>
        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Wedding Services Platform
        <span className="highlight"> | All Rights Reserved</span>
      </div>

    </footer>
  );
};

export default Footer;
