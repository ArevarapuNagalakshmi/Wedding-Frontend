import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Wedding Services</h1>
        <p>
          A modern platform designed to simplify wedding planning
          by connecting customers with trusted vendors in one place.
        </p>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide a secure and centralized platform
          where customers can discover, compare, and book professional
          wedding vendors seamlessly.
        </p>
      </section>

      {/* Features Section */}
      <section className="about-features">

        <div className="about-card">
          <h3>Verified Vendors</h3>
          <p>
            We ensure vendors are reviewed and approved for quality
            and reliability.
          </p>
        </div>

        <div className="about-card">
          <h3>Role-Based Access</h3>
          <p>
            Separate profiles for Admin, Vendor, and Customer
            for secure and efficient management.
          </p>
        </div>

        <div className="about-card">
          <h3>Secure Authentication</h3>
          <p>
            JWT-based authentication ensures secure login
            and protected APIs.
          </p>
        </div>

      </section>

      {/* Footer */}
      <div className="about-footer">
        © 2026 Wedding Services Platform. All rights reserved.
      </div>

    </div>
  );
};

export default About;
