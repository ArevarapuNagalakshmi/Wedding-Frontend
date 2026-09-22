import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaShare, FaPhone, FaEnvelope, FaInstagram, FaCog, FaThLarge } from "react-icons/fa";
import Loader from "../components/common/Loader";
import { getVendorById } from "../api/vendorApi";
import { getPackagesByVendor } from "../api/serviceApi";
import "../styles/VendorProfile.css";

const VendorProfilePage = () => {
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [services, setServices] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [isLiking, setIsLiking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVendorProfile = async () => {
      if (!vendorId) {
        setError("Vendor information is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [vendorResponse, servicesResponse] = await Promise.all([
          getVendorById(vendorId),
          getPackagesByVendor(vendorId),
        ]);

        const vendor = vendorResponse?.data || null;
        const vendorServices = Array.isArray(servicesResponse?.data) ? servicesResponse.data : [];

        const normalizedVendor = {
          id: vendor?.id || vendorId,
          businessName: vendor?.businessName || vendor?.name || `Vendor ${vendorId}`,
          category: vendor?.category || "Wedding Service",
          avatar: vendor?.imageUrls?.[0] || vendor?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          coverImage: vendor?.imageUrls?.[1] || vendor?.coverImage || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=400&fit=crop",
          description: vendor?.description || "Professional wedding service provider ready to help make your celebration special.",
          city: vendor?.city || vendor?.location || "Location not specified",
          rating: vendor?.rating ?? 0,
          reviews: vendor?.reviews ?? vendor?.reviewCount ?? 0,
          followers: vendor?.followers ?? vendor?.followerCount ?? 0,
          following: vendor?.following ?? vendor?.followingCount ?? 0,
          bio: vendor?.bio || vendor?.description || "Trusted wedding vendor with excellent service.",
          phone: vendor?.phone || "",
          email: vendor?.email || "",
          instagram: vendor?.instagram || "",
          website: vendor?.website || "",
          verified: Boolean(vendor?.verified),
          responseTime: vendor?.responseTime || "",
          pricingRange: vendor?.pricingRange || "",
        };

        setVendorData(normalizedVendor);
        setServices(
          vendorServices.map((service) => ({
            id: service.id,
            title: service.name || "Service Package",
            image: service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
            price: service.price,
            likes: 0,
            description: service.description,
          }))
        );
      } catch (err) {
        console.error("Unable to load vendor profile", err);
        setError("Unable to load vendor profile right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVendorProfile();
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

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") return "Price on request";

    const numericValue = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(numericValue)) return value;

    return `₹${numericValue.toLocaleString("en-IN")}`;
  };

  const getWebsiteUrl = (website) => {
    if (!website) return "#";
    if (/^https?:\/\//i.test(website)) return website;
    return `https://${website}`;
  };

  const getInstagramUrl = (instagram) => {
    if (!instagram) return "#";
    return `https://instagram.com/${instagram.replace(/^@/, "")}`;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="vendor-profile-container">
        <div className="about-section">
          <div className="about-card">
            <h2>Vendor profile unavailable</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="vendor-profile-container">
        <div className="about-section">
          <div className="about-card">
            <h2>Vendor not found</h2>
            <p>No vendor information is available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="vendor-profile-container">
        <div className="profile-cover">
          <img src={vendorData?.coverImage} alt="cover" />
        </div>

        <div className="profile-header">
          <div className="profile-info-main">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                <img src={vendorData?.avatar} alt={vendorData?.businessName} />
                {vendorData?.verified && <span className="verified-badge">✓</span>}
              </div>
            </div>

            <div className="profile-info-content">
              <div className="profile-name-section">
                <div className="profile-name-meta">
                  <div className="profile-eyebrow">{vendorData?.category}</div>
                  <h1>{vendorData?.businessName}</h1>
                  <p className="profile-handle">{vendorData?.instagram || vendorData?.city}</p>
                </div>

                <div className="profile-header-actions">
                  <button type="button" className={`profile-btn neutral ${isFollowing ? 'following' : ''}`} onClick={handleFollowToggle}>
                    {isFollowing ? <FaHeart /> : <FaRegHeart />} {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="settings-btn" aria-label="Profile settings">
                    <FaCog />
                  </button>
                </div>
              </div>

              <div className="profile-summary-row">
                <div className="summary-pill">
                  <span className="pill-value">{services.length}</span>
                  <span className="pill-label">Packages</span>
                </div>
                <div className="summary-pill">
                  <span className="pill-value">{vendorData?.reviews}</span>
                  <span className="pill-label">Reviews</span>
                </div>
                <div className="summary-pill">
                  <span className="pill-value">{vendorData?.followers}</span>
                  <span className="pill-label">Followers</span>
                </div>
                <div className="summary-pill highlight">
                  <span className="pill-rating">
                    <FaStar className="star-icon" /> {vendorData?.rating}
                  </span>
                  <span className="pill-label">Rated</span>
                </div>
              </div>

              <p className="profile-bio">{vendorData?.bio}</p>

              <div className="quick-facts">
                <div className="fact-item">
                  <span className="fact-label">Location</span>
                  <span className="fact-value"><FaMapMarkerAlt /> {vendorData?.city}</span>
                </div>
                <div className="fact-item">
                  <span className="fact-label">Experience</span>
                  <span className="fact-value">{vendorData?.responseTime || (vendorData?.category === "Photography" ? "10+ years" : "Trusted wedding professional")}</span>
                </div>
                <div className="fact-item">
                  <span className="fact-label">Starting from</span>
                  <span className="fact-value">{vendorData?.pricingRange || formatPrice(services[0]?.price || 0)}</span>
                </div>
              </div>
            </div>

            <div className="profile-side-panel">
              <div className="side-panel-card">
                <div className="panel-badge">Available for bookings</div>
                <h3>Plan your perfect celebration</h3>
                <p>{vendorData?.description}</p>
                <div className="side-actions">
                  <button className="action-btn primary">
                    <FaPhone /> Contact
                  </button>
                  <button className="action-btn">
                    <FaEnvelope /> Message
                  </button>
                </div>
                <div className="contact-list">
                  {vendorData?.phone && (
                    <a href={`tel:${vendorData?.phone}`}>
                      <FaPhone /> {vendorData?.phone}
                    </a>
                  )}
                  {vendorData?.email && (
                    <a href={`mailto:${vendorData?.email}`}>
                      <FaEnvelope /> {vendorData?.email}
                    </a>
                  )}
                  {vendorData?.website && (
                    <a href={getWebsiteUrl(vendorData?.website)} target="_blank" rel="noopener noreferrer">
                      <FaShare /> {vendorData?.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-icon-nav">
          <button className={`icon-tab ${activeTab === 'services' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('services')}>
            <FaThLarge />
            <span>Packages</span>
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

        <div className="profile-content">
          {activeTab === "services" && (
            <div className="services-professional-grid">
              {services.length === 0 ? (
                <div className="about-card" style={{ width: "100%" }}>
                  <h2>No packages available</h2>
                  <p>This vendor has not added any packages yet.</p>
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="service-professional-card">
                    <div className="service-image-container">
                      <img src={service.image} alt={service.title} />
                      <span className="service-price-badge">{formatPrice(service.price)}</span>
                    </div>
                    <div className="service-card-body">
                      <div className="service-card-topline">
                        <span className="service-tag">Wedding package</span>
                        <button
                          type="button"
                          className={`like-btn ${isLiking[service.id] ? "liked" : ""}`}
                          onClick={() => handleLikeToggle(service.id)}
                          aria-label={isLiking[service.id] ? "Unlike service" : "Like service"}
                        >
                          {isLiking[service.id] ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.description || "Tailored wedding service designed to create a smooth and memorable experience for your special day."}</p>
                      <div className="service-card-footer">
                        <span className="service-meta"><FaStar /> {vendorData?.rating} rating</span>
                        <button type="button" className="service-cta">Book now</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="about-section">
              <div className="about-card">
                <h2>About {vendorData?.businessName}</h2>
                <p>{vendorData?.description}</p>

                <div className="about-details">
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{vendorData?.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{vendorData?.city}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rating</span>
                    <span className="detail-value"><FaStar className="star-icon" /> {vendorData?.rating} ({vendorData?.reviews} reviews)</span>
                  </div>
                </div>

                <div className="contact-info">
                  <h3>Contact Information</h3>
                  {vendorData?.phone && (
                    <div className="contact-item">
                      <FaPhone /> <a href={`tel:${vendorData?.phone}`}>{vendorData?.phone}</a>
                    </div>
                  )}
                  {vendorData?.email && (
                    <div className="contact-item">
                      <FaEnvelope /> <a href={`mailto:${vendorData?.email}`}>{vendorData?.email}</a>
                    </div>
                  )}
                  {vendorData?.instagram && (
                    <div className="contact-item">
                      <FaInstagram /> <a href={getInstagramUrl(vendorData?.instagram)} target="_blank" rel="noopener noreferrer">{vendorData?.instagram}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
