import React, { useCallback, useContext, useEffect, useState } from "react";
import { searchServices } from "../../api/serviceApi";
import { getVendorById } from "../../api/vendorApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import { CartContext } from "../../context/CartContext";
import CustomerPageLayout from "./CustomerPageLayout";
import "../../styles/ServiceList.css";

const fallbackServiceSamples = {
  Photography: [
    {
      id: "fallback-photography-1",
      vendorName: "Rahul Photography",
      packageName: "Wedding Photography Package",
      experience: "6 Years",
      city: "Hyderabad",
      rating: "4.8",
      price: 15000,
      description: "Full-day coverage with premium editing and wedding album support.",
    },
    {
      id: "fallback-photography-2",
      vendorName: "Sai Digital Studio",
      packageName: "Premium Couple Shoot",
      experience: "8 Years",
      city: "Vijayawada",
      rating: "4.9",
      price: 20000,
      description: "Cinematic storytelling with multiple locations, pre-wedding and wedding day coverage.",
    },
    {
      id: "fallback-photography-3",
      vendorName: "Priya Lens",
      packageName: "Deluxe Wedding Photography",
      experience: "7 Years",
      city: "Bangalore",
      rating: "4.7",
      price: 18000,
      description: "Artistic wedding photography with candid moments and high-end portrait delivery.",
    },
    {
      id: "fallback-photography-4",
      vendorName: "Nikhil Memories",
      packageName: "Complete Wedding Coverage",
      experience: "5 Years",
      city: "Chennai",
      rating: "4.6",
      price: 16000,
      description: "Customized photography packages with drone shots and highlight reels.",
    },
  ],
  Videography: [
    {
      id: "fallback-videography-1",
      vendorName: "Frame Wave Films",
      packageName: "Cinematic Wedding Film",
      experience: "7 Years",
      city: "Hyderabad",
      rating: "4.8",
      price: 22000,
      description: "Cinematic wedding film with drone coverage and highlight trailers.",
    },
    {
      id: "fallback-videography-2",
      vendorName: "Lens & Motion",
      packageName: "Full Event Videography",
      experience: "6 Years",
      city: "Vijayawada",
      rating: "4.7",
      price: 20000,
      description: "Multi-camera coverage for ceremonies, receptions, and pre-wedding shoots.",
    },
  ],
  Catering: [
    {
      id: "fallback-catering-1",
      vendorName: "Silver Spoon Caterers",
      packageName: "Deluxe Wedding Menu",
      experience: "10 Years",
      city: "Hyderabad",
      rating: "4.9",
      price: 45000,
      description: "Multi-cuisine wedding catering with live counters and premium desserts.",
    },
    {
      id: "fallback-catering-2",
      vendorName: "Banquet Bites",
      packageName: "Royal Feast Package",
      experience: "8 Years",
      city: "Vijayawada",
      rating: "4.7",
      price: 42000,
      description: "Customized wedding catering with plated service, buffet, and healthy options.",
    },
  ],
  Decoration: [
    {
      id: "fallback-decoration-1",
      vendorName: "Floral Fantasy",
      packageName: "Premium Wedding Decor",
      experience: "9 Years",
      city: "Hyderabad",
      rating: "4.8",
      price: 30000,
      description: "Luxury floral and stage decoration with personalized themes and lighting.",
    },
    {
      id: "fallback-decoration-2",
      vendorName: "Elite Events",
      packageName: "Venue Styling Package",
      experience: "7 Years",
      city: "Vijayawada",
      rating: "4.6",
      price: 28000,
      description: "Stylish wedding decor for ceremony and reception spaces with premium props.",
    },
  ],
  "Wedding Venue": [
    {
      id: "fallback-venue-1",
      vendorName: "Royal Banquets",
      packageName: "Grand Venue Booking",
      experience: "12 Years",
      city: "Hyderabad",
      rating: "4.9",
      price: 60000,
      description: "Spacious banquet hall with premium catering and guest parking included.",
    },
    {
      id: "fallback-venue-2",
      vendorName: "Garden Greens",
      packageName: "Outdoor Venue Package",
      experience: "8 Years",
      city: "Vijayawada",
      rating: "4.8",
      price: 55000,
      description: "Scenic outdoor wedding venue with garden seating, lighting, and decor support.",
    },
  ],
  "Makeup Artist": [
    {
      id: "fallback-makeup-1",
      vendorName: "Glamour Artistry",
      packageName: "Bridal Makeup",
      experience: "6 Years",
      city: "Hyderabad",
      rating: "4.8",
      price: 12000,
      description: "Bridal makeup with trial session, touch-ups, and skincare prep.",
    },
    {
      id: "fallback-makeup-2",
      vendorName: "Beauty Bliss",
      packageName: "Full Bridal Styling",
      experience: "7 Years",
      city: "Vijayawada",
      rating: "4.7",
      price: 14000,
      description: "Complete bridal beauty package with hair styling, makeup, and accessory setup.",
    },
  ],
  "DJ & Music": [
    {
      id: "fallback-dj-1",
      vendorName: "Beat Masters",
      packageName: "Wedding DJ Package",
      experience: "8 Years",
      city: "Hyderabad",
      rating: "4.9",
      price: 18000,
      description: "Live DJ and lighting services for your reception and sangeet nights.",
    },
    {
      id: "fallback-dj-2",
      vendorName: "Rhythm Riders",
      packageName: "Music & MC",
      experience: "9 Years",
      city: "Vijayawada",
      rating: "4.8",
      price: 17000,
      description: "DJ service with sound, lighting, and emcee support for seamless events.",
    },
  ],
  Transportation: [
    {
      id: "fallback-transport-1",
      vendorName: "Royal Rides",
      packageName: "Luxury Car Service",
      experience: "7 Years",
      city: "Hyderabad",
      rating: "4.7",
      price: 12000,
      description: "Luxury wedding transportation for bride, groom, and VIP guests.",
    },
    {
      id: "fallback-transport-2",
      vendorName: "Wedding Wheels",
      packageName: "Guest Shuttle Service",
      experience: "6 Years",
      city: "Vijayawada",
      rating: "4.6",
      price: 10000,
      description: "Guest pick-up and drop-off service with multiple vehicles and drivers.",
    },
  ],
  Mehendi: [
    {
      id: "fallback-mehendi-1",
      vendorName: "Henna Creations",
      packageName: "Bridal Mehendi",
      experience: "8 Years",
      city: "Hyderabad",
      rating: "4.9",
      price: 9000,
      description: "Traditional and contemporary bridal mehendi with floral and glitter accents.",
    },
    {
      id: "fallback-mehendi-2",
      vendorName: "Mehendi Magic",
      packageName: "Guest Mehendi Designs",
      experience: "7 Years",
      city: "Vijayawada",
      rating: "4.8",
      price: 7000,
      description: "Beautiful mehendi designs for the bride, groom, and guests with fast application.",
    },
  ],
};

const defaultFallbackServices = [
  ...fallbackServiceSamples.Photography,
  ...fallbackServiceSamples.Videography,
  ...fallbackServiceSamples.Catering,
  ...fallbackServiceSamples.Decoration,
  ...fallbackServiceSamples["Wedding Venue"],
  ...fallbackServiceSamples["Makeup Artist"],
  ...fallbackServiceSamples["DJ & Music"],
  ...fallbackServiceSamples.Transportation,
  ...fallbackServiceSamples.Mehendi,
];

const getFallbackServices = (category) => {
  if (!category) return defaultFallbackServices;
  return fallbackServiceSamples[category] || defaultFallbackServices;
};

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorDetails, setVendorDetails] = useState({});
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    availableDate: "",
  });

  const isUsingFallback = services.length === 0;
  const displayedServices = isUsingFallback ? getFallbackServices(filters.category) : services;

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, isServiceInCart } = useContext(CartContext);
  const quickActions = [
    {
      title: "Browse Services",
      description: "Discover curated wedding vendor packages with reviews and pricing.",
      button: "Explore now",
      to: "/customer/services",
    },
    {
      title: "My Bookings",
      description: "View your confirmed bookings, upcoming events, and reservation details.",
      button: "View bookings",
      to: "/customer/bookings",
    },
    {
      title: "Saved Vendors",
      description: "Keep a shortlist of trusted vendors for your wedding planning.",
      button: "Browse vendors",
      to: "/customer/saved-vendors",
    },
    {
      title: "Planning Tips",
      description: "Get expert advice on how to manage vendor quotes, timelines, and budgets.",
      button: "Get started",
      to: "/customer/services",
    },
    {
      title: "My Profile",
      description: "Save your wedding preferences, contact details, and planning timeline in one place.",
      button: "Edit profile",
      to: "/customer/profile",
    },
  ];

  const loadServices = useCallback(async (searchFilters = {}) => {
    setLoading(true);
    setError("");

    try {
      const res = await searchServices(searchFilters);
      setServices(res.data || []);
    } catch (err) {
      console.error("Service fetch failed", err);
      const status = err?.response?.status;
      let message = "Unable to load services. Please try again later.";

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      if (status === 403) {
        const localRole = localStorage.getItem("role");
        if (localRole !== "CUSTOMER") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/unauthorized");
          return;
        }

        message =
          "Access denied. Your account does not have permission to view services. Please contact support or log in with a customer account.";
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || undefined;
    const categoryParam = params.get("category") || undefined;
    const initialFilters = {};

    if (q) initialFilters.q = q;
    if (categoryParam) {
      initialFilters.category = categoryParam;
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }

    loadServices(initialFilters);
  }, [loadServices, location.search]);

  useEffect(() => {
    const pendingVendorIds = services
      .map((service) => service.vendorId)
      .filter(Boolean)
      .filter((vendorId) => !vendorDetails[vendorId]);

    if (!pendingVendorIds.length) return;

    const loadVendorDetails = async () => {
      try {
        const results = await Promise.all(
          pendingVendorIds.map(async (vendorId) => {
            try {
              const response = await getVendorById(vendorId);
              return [vendorId, response?.data || null];
            } catch (err) {
              return [vendorId, null];
            }
          })
        );

        setVendorDetails((prev) => {
          const next = { ...prev };
          results.forEach(([vendorId, vendor]) => {
            if (vendor) next[vendorId] = vendor;
          });
          return next;
        });
      } catch (err) {
        console.error("Unable to load vendor details", err);
      }
    };

    loadVendorDetails();
  }, [services, vendorDetails]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const searchParams = {
      city: filters.city || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      minRating: filters.minRating || undefined,
      availableDate: filters.availableDate || undefined,
    };

    loadServices(searchParams);
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      availableDate: "",
    });
    loadServices({});
  };

  

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="service-list-error">
        <h4>Unable to load services</h4>
        <p>{error}</p>
        <div className="error-actions">
          <button className="btn btn-primary" onClick={() => loadServices(filters)}>
            Try Again
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/customer") }>
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const renderServiceCards = () => {
    if (!displayedServices || displayedServices.length === 0) {
      return (
        <div className="service-list-empty">
          <h3>No services match your filters</h3>
          <p>Try broadening your search criteria or clearing filters to browse all available services.</p>
        </div>
      );
    }

    return (
      <div className="service-grid">
        {displayedServices.map((service) => {
          const vendor = service.vendorId ? vendorDetails[service.vendorId] : null;
          const vendorName = vendor?.businessName || vendor?.name || service.vendorName || `Vendor ${service.vendorId || ""}`;
          const packageName = service.name || service.packageName || "Wedding package";
          const vendorExperience = vendor?.responseTime || service.experience || "Experienced wedding professional";
          const location = service.city || vendor?.city || "Hyderabad";
          const ratingText = service.rating ? `⭐ ${service.rating}` : vendor?.rating ? `⭐ ${vendor.rating}` : "⭐ 4.8";
          const cardTitle = vendorName;
          const cardSubtitle = `${packageName}`;
          const profileUrl = service.vendorId ? `/vendor/${service.vendorId}` : "/customer/services";

          return (
            <article className="service-card profile-card" key={service.id}>
              <div className="service-card-header">
                <span className="service-card-photo-icon">📷</span>
                <div>
                  <h3>{cardTitle}</h3>
                  <p className="service-card-subtitle">{cardSubtitle}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-detail-row">
                  <span>Name :</span>
                  <strong>{vendorName}</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Experience :</span>
                  <strong>{vendorExperience.replace(" wedding photography", "")}</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Location :</span>
                  <strong>{location}</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Rating :</span>
                  <strong>{ratingText}</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Price :</span>
                  <strong>₹{service.price}</strong>
                </div>
              </div>

              <div className="service-card-actions profile-actions">
                <Link to={profileUrl} className="btn btn-primary">
                  View Profile
                </Link>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => addToCart(service)}
                  disabled={isServiceInCart(service.id)}
                >
                  {isServiceInCart(service.id) ? "Booked" : "Book Now"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const sidebarLinks = quickActions.map((a) => ({
    label: a.title,
    description: a.description,
    to: a.to,
  }));

  return (
    <CustomerPageLayout
      title="Services"
      className="service-list-page"
    >
      <div className="service-list-main">
        <div className="service-list-summary">
          <div>
            <h2 className="service-list-heading">
              {filters.category ? `${filters.category} Services` : "Discover wedding services"}
            </h2>
            <p className="service-list-description">
              Browse curated vendor packages to compare pricing, availability, and reviews in one place.
            </p>
          </div>
          <div className="service-list-badge">{displayedServices.length} services available</div>
        </div>

        <section className="filter-panel">
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Category"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="minPrice">Min Budget</label>
            <input
              id="minPrice"
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="maxPrice">Max Budget</label>
            <input
              id="maxPrice"
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="0"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="minRating">Min Rating</label>
            <input
              id="minRating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="4.0"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="availableDate">Available Date</label>
            <input
              id="availableDate"
              type="date"
              name="availableDate"
              value={filters.availableDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-outline" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className="service-results">{renderServiceCards()}</section>
      </div>
    </CustomerPageLayout>
  );
};

export default ServiceList;
