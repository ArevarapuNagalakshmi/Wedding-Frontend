import React from "react";
import { FaHeart, FaLock, FaShieldAlt, FaUsers } from "react-icons/fa";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="about-kicker">The thoughtful way to plan</span>
          <h1>Bring your wedding vision into focus.</h1>
        <p>
          Plan E Weddings brings couples and trusted wedding professionals
          together in one calm, connected place.
        </p>
          <div className="about-hero-mark" aria-hidden="true"><FaHeart /></div>
        </div>
        <div className="about-hero-note">
          <span>Built for real celebrations</span>
          <strong>Discover. Compare. Celebrate.</strong>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <span className="about-kicker">Why we exist</span>
        <h2>Planning should feel personal, not complicated.</h2>
        <p>
          Our mission is to make every important decision easier: find the
          right people, understand what they offer, and move from inspiration
          to a confident booking without losing the feeling behind the day.
        </p>
      </section>

      {/* Features Section */}
      <section className="about-features">

        <div className="about-card">
          <div className="about-card-icon"><FaShieldAlt /></div>
          <h3>Verified Vendors</h3>
          <p>
            We ensure vendors are reviewed and approved for quality
            and reliability.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon"><FaUsers /></div>
          <h3>Role-Based Access</h3>
          <p>
            Separate profiles for Admin, Vendor, and Customer
            for secure and efficient management.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon"><FaLock /></div>
          <h3>Secure Authentication</h3>
          <p>
            JWT-based authentication ensures secure login
            and protected APIs.
          </p>
        </div>

      </section>

      <section className="about-snapshot" aria-label="Platform snapshot">
        <div>
          <span className="about-kicker">One connected workspace</span>
          <h2>Made for the people behind the celebration.</h2>
        </div>
        <div className="about-snapshot-items">
          <div><strong>Couples</strong><span>Find services that fit your day.</span></div>
          <div><strong>Vendors</strong><span>Show your work and grow your business.</span></div>
          <div><strong>Admins</strong><span>Keep the marketplace trusted.</span></div>
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
