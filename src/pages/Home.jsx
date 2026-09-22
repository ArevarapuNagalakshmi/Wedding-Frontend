import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaUsers, FaLock, FaHeart, FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

import "../styles/Home.css";

const popularServices = [
  {
    title: "Photography",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
    description: "Capture every moment with professional wedding photography.",
    rating: "4.9/5",
    count: "2.5K+ vendors",
    backText: "Professional photographers with 10+ years experience",
  },
  {
    title: "Videography",
    image:
      "https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=700&q=80",
    description: "Record your wedding day with cinematic video coverage.",
    rating: "4.8/5",
    count: "1.8K+ vendors",
    backText: "4K & 8K cinematic videos with drone footage",
  },
  {
    title: "Catering",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=700&q=80",
    description: "Delicious catering services tailored to your style.",
    rating: "4.7/5",
    count: "3.2K+ vendors",
    backText: "Diverse cuisines and customizable menu options",
  },
];

const moreServices = [
  {
    title: "Decoration",
    image:
      "https://images.unsplash.com/photo-1492414496866-f8ee94f1f03d?auto=format&fit=crop&w=700&q=80",
    description: "Elegant venue and tabletop decoration for every wedding theme.",
    rating: "4.8/5",
    count: "1.9K+ vendors",
    backText: "Traditional & modern themes with custom designs",
  },
  {
    title: "Venue Booking",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
    description: "Find and book your ideal wedding venue with ease.",
    rating: "4.9/5",
    count: "2.1K+ venues",
    backText: "Indoor, outdoor & destination venues available",
  },
  {
    title: "Makeup Artist",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80",
    description: "Bridal and guest makeup services tailored to your style.",
    rating: "4.9/5",
    count: "2.3K+ artists",
    backText: "Bridal package includes trial & touch-ups",
  },
  {
    title: "DJ & Music",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
    description: "Live DJ and music production to keep guests dancing.",
    rating: "4.7/5",
    count: "1.5K+ DJs",
    backText: "Live bands, orchestras & DJ services available",
  },
  {
    title: "Flower Decoration",
    image:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=700&q=80",
    description: "Fresh floral décor that enhances every wedding space.",
    rating: "4.8/5",
    count: "1.7K+ florists",
    backText: "Fresh & artificial flowers with same-day delivery",
  },
  {
    title: "Stage Decoration",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    description: "Showcase your ceremony with stunning stage design.",
    rating: "4.9/5",
    count: "1.2K+ designers",
    backText: "LED screens, backdrops & lighting included",
  },
  {
    title: "Mehendi Artist",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=700&q=80",
    description: "Beautiful mehendi designs for brides and guests.",
    rating: "4.9/5",
    count: "1.6K+ artists",
    backText: "Traditional & fusion mehendi by certified artists",
  },
];

const Home = () => {
  const { token, role } = useContext(AuthContext);
  const isCustomer = token && role === "CUSTOMER";
  const guestDestination = "/login";
  const serviceLink = isCustomer ? "/customer/services" : guestDestination;
  const ctaLink = isCustomer ? "/customer" : "/register";
  const ctaLabel = isCustomer ? "Go to Dashboard" : "Create Account";

  return (
    <div className="home-wrapper">

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-kicker"><FaHeart /> Plan E Weddings</span>

          <h1>
            The beautiful beginning to your forever.
          </h1>

          <p>
            Discover verified vendors, compare packages, and book your wedding services with confidence.
            Everything you need for an unforgettable celebration is just a few clicks away.
          </p>

          <div className="hero-buttons">
            {isCustomer ? (
              <>
                <Link to="/customer" className="btn-primary btn-create-account-hero">
                  Go to Dashboard
                </Link>
                <Link to="/customer/services" className="btn-secondary">
                  Browse Services
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>

                <Link to="/register" className="btn-primary btn-create-account-hero">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="hero-trust-row">
            <span>Verified professionals</span>
            <span>Secure bookings</span>
            <span>One calm workspace</span>
          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features-section">

        <div className="feature-card">
          <FaEnvelope className="feature-icon" />
          <h3>Secure Email Verification</h3>
          <p>Advanced OTP-based email authentication.</p>
        </div>

        <div className="feature-card">
          <FaUsers className="feature-icon" />
          <h3>Verified Vendors</h3>
          <p>Only trusted and approved wedding professionals.</p>
        </div>

        <div className="feature-card">
          <FaLock className="feature-icon" />
          <h3>Secure Booking</h3>
          <p>JWT-secured booking system with data protection.</p>
        </div>

      </section>


      {/* SERVICES */}

      <section className="services-section">

        <span className="section-kicker">Find your people</span>
        <h2>Services that shape the day.</h2>
        <p className="section-intro">From the first photograph to the final dance, discover trusted specialists for every meaningful detail.</p>

        <div className="services-grid">
          {popularServices.map((service) => (
            <Link
              to={`${serviceLink}?category=${encodeURIComponent(service.title)}`}
              key={service.title}
              className="service-card-flip"
              aria-label={`Browse ${service.title}`}
            >
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-image-wrapper">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="service-image"
                    />
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
                <div className="service-card-back">
                  <div className="back-content">
                    <div className="rating-badge">
                      <span className="rating">{service.rating}</span>
                      <span className="count">{service.count}</span>
                    </div>
                    <p className="back-text">{service.backText}</p>
                    <div className="btn-explore">Explore Now <FaArrowRight /></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="more-services-section">
        <div className="more-services-grid">
          {moreServices.map((service) => (
            <Link
              to={`${serviceLink}?category=${encodeURIComponent(service.title)}`}
              key={service.title}
              className="service-card-flip"
              aria-label={`Browse ${service.title}`}
            >
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-image-wrapper">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="service-image"
                    />
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
                <div className="service-card-back">
                  <div className="back-content">
                    <div className="rating-badge">
                      <span className="rating">{service.rating}</span>
                      <span className="count">{service.count}</span>
                    </div>
                    <p className="back-text">{service.backText}</p>
                    <div className="btn-explore">Explore Now <FaArrowRight /></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* FINAL CTA */}

      <section className="final-cta">
        <div className="final-cta-content">
          <div className="final-cta-copy">
            <p className="final-cta-pretitle">Create your perfect wedding</p>
            <h2>Plan every detail with trusted vendors and expert support.</h2>
            <p className="final-cta-description">
              Sign up now to discover curated services, secure bookings, and a seamless planning experience designed for modern couples.
            </p>
          </div>

          <Link to={ctaLink} className="btn-primary final-cta-button">
            {ctaLabel}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
