import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaShare, FaPhone, FaEnvelope, FaInstagram, FaCog, FaThLarge } from "react-icons/fa";
import Loader from "../components/common/Loader";
import "../styles/VendorProfile.css";

const VendorProfilePage = () => {
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [services, setServices] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [isLiking, setIsLiking] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockVendor = {
      id: vendorId || 1,
      businessName: "Elegant Photography Studio",
      category: "Photography",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=400&fit=crop",
      description: "Professional wedding photography with 10+ years of experience. Capturing moments, creating memories 📸",
      city: "Mumbai",
      rating: 4.9,
      reviews: 324,
      followers: 2500,
      following: 120,
      bio: "📸 Professional Wedding Photographer | 📍 Mumbai | ✨ 10+ Years Experience",
      phone: "+91-9876543210",
      email: "contact@elegantphotography.com",
      instagram: "@elegantphotography",
      website: "www.elegantphotography.com",
      verified: true,
    };

    const mockServices = [
      {
        id: 1,
        title: "Pre-Wedding Shoot",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
        price: "₹25,000",
        likes: 156,
      },
      {
        id: 2,
        title: "Wedding Day Coverage",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        price: "₹50,000",
        likes: 298,
      },
      {
        id: 3,
        title: "Candid Photography",
        image: "https://images.unsplash.com/photo-1525268014386-ba8627b8a7ad?w=400&h=400&fit=crop",
        price: "₹35,000",
        likes: 187,
      },
      {
        id: 4,
        title: "Album Design",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
        price: "₹10,000",
        likes: 124,
      },
      {
        id: 5,
        title: "Videography",
        image: "https://images.unsplash.com/photo-1509379119910-c9078f1c4601?w=400&h=400&fit=crop",
        price: "₹75,000",
        likes: 212,
      },
      {
        id: 6,
        title: "4K Cinematic Video",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
        price: "₹1,00,000",
        likes: 445,
      },
    ];

    setVendorData(mockVendor);
    setServices(mockServices);
    setLoading(false);
  }, [vendorId]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLikeToggle = (serviceId) => {
    setIsLiking((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="vendor-profile-container">
        {/* Cover Image */}
        <div className="profile-cover">
          <img src={vendorData?.coverImage} alt="cover" />
        </div>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-info-main">
            {/* Avatar */}
            <div className="profile-avatar">
              <img src={vendorData?.avatar} alt={vendorData?.businessName} />
              {vendorData?.verified && <span className="verified-badge">✓</span>}
            </div>

            {/* Info Section */}
            <div className="profile-info-content">
              <div className="profile-name-section">
                <div className="profile-name-meta">
                  <h1>{vendorData?.businessName}</h1>
                  <p className="profile-handle">{vendorData?.instagram}</p>
                </div>
                <button className="settings-btn" aria-label="Profile settings">
                  <FaCog />
                </button>
              </div>

              <div className="profile-counts">
                <div className="count-item">
                  <span>{services.length}</span>
                  <span>posts</span>
                </div>
                <div className="count-item">
                  <span>{vendorData?.followers}</span>
                  <span>followers</span>
                </div>
                <div className="count-item">
                  <span>{vendorData?.following}</span>
                  <span>following</span>
                </div>
              </div>

              <div className="profile-buttons">
                <button type="button" className="profile-btn">
                  Edit profile
                </button>
                <button type="button" className="profile-btn">
                  View archive
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className={`profile-btn ${isFollowing ? 'following' : ''}`} onClick={handleFollowToggle}>
                  {isFollowing ? <FaHeart /> : <FaRegHeart />} {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <a className="profile-link" href={`https://${vendorData?.website}`} target="_blank" rel="noopener noreferrer">
                {vendorData?.website}
              </a>

              <p className="profile-category">{vendorData?.category}</p>
              <p className="profile-bio">{vendorData?.bio}</p>

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{vendorData?.reviews}</span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat">
                  <div className="stat-rating">
                    <FaStar className="star-icon" />
                    <span>{vendorData?.rating}</span>
                  </div>
                  <span className="stat-label">Rating</span>
                </div>
              </div>

              <div className="profile-location">
                <FaMapMarkerAlt /> {vendorData?.city}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button className="action-btn primary">
                <FaPhone /> Contact
              </button>
              <button className="action-btn">
                <FaShare /> Share
              </button>
              <button className="action-btn">
                <FaEnvelope /> Message
              </button>
            </div>
          </div>
        </div>

        {/* Profile icon navigation */}
        <div className="profile-icon-nav">
          <button className={`icon-tab ${activeTab === 'services' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('services')}>
            <FaThLarge />
            <span>Posts</span>
          </button>
          <button className={`icon-tab ${activeTab === 'about' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('about')}>
            <FaCog />
            <span>About</span>
          </button>
          <button className={`icon-tab ${activeTab === 'reviews' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('reviews')}>
            <FaStar />
            <span>Reviews</span>
          </button>
        </div>

        {/* Content Sections */}
        <div className="profile-content">
          {/* Services Grid */}
          {activeTab === "services" && (
            <div className="services-instagram-grid">
              {services.map((service) => (
                <div key={service.id} className="service-instagram-card">
                  <div className="service-image-container">
                    <img src={service.image} alt={service.title} />
                    <div className="service-overlay">
                      <div className="service-overlay-info">
                        <div className="overlay-stat">
                          <FaHeart /> {service.likes}
                        </div>
                        <div className="overlay-stat">
                          <span>{service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-card-footer">
                    <button
                      className={`like-btn ${isLiking[service.id] ? "liked" : ""}`}
                      onClick={() => handleLikeToggle(service.id)}
                    >
                      {isLiking[service.id] ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <h3>{service.title}</h3>
                    <span className="service-price">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="about-section">
              <div className="about-card">
                <h2>About {vendorData?.businessName}</h2>
                <p>{vendorData?.description}</p>

                <div className="about-details">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{vendorData?.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{vendorData?.city}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rating:</span>
                    <span className="detail-value">
                      <FaStar className="star-icon" /> {vendorData?.rating} ({vendorData?.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="contact-info">
                  <h3>Contact Information</h3>
                  <div className="contact-item">
                    <FaPhone /> <a href={`tel:${vendorData?.phone}`}>{vendorData?.phone}</a>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope /> <a href={`mailto:${vendorData?.email}`}>{vendorData?.email}</a>
                  </div>
                  <div className="contact-item">
                    <FaInstagram /> <a href={`https://instagram.com/${vendorData?.instagram}`} target="_blank" rel="noopener noreferrer">{vendorData?.instagram}</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="reviews-section">
              <div className="reviews-container">
                <h2>Customer Reviews ({vendorData?.reviews})</h2>
                
                <div className="review-card">
                  <div className="review-header">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="reviewer" className="reviewer-avatar" />
                    <div className="reviewer-info">
                      <h4>Priya Sharma</h4>
                      <div className="review-rating">
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="review-text">Amazing photography! The team was professional and captured every moment beautifully. Highly recommended!</p>
                  <span className="review-date">2 weeks ago</span>
                </div>

                <div className="review-card">
                  <div className="review-header">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="reviewer" className="reviewer-avatar" />
                    <div className="reviewer-info">
                      <h4>Arjun Kumar</h4>
                      <div className="review-rating">
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="review-text">Best wedding photographer we've worked with. Their attention to detail and creativity is outstanding!</p>
                  <span className="review-date">1 month ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VendorProfilePage;
