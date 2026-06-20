import React, { useCallback, useContext, useEffect, useState } from "react";
import { searchServices } from "../../api/serviceApi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { CartContext } from "../../context/CartContext";
import CustomerHeader from "./CustomerHeader";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    availableDate: "",
  });

  const navigate = useNavigate();
  const { addToCart, isServiceInCart, toggleSaveVendor, isVendorSaved } = useContext(CartContext);
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
    loadServices(filters);
  }, [filters, loadServices]);

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
    if (!services || services.length === 0) {
      return (
        <div className="row">
          <div className="col-12">
            <p>No services available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="row service-list-results">
        {services.map((service) => (
          <div className="col-12 col-md-6" key={service.id}>
            <div className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p>
                <strong>Category:</strong> {service.category}
              </p>
              <p>
                <strong>City:</strong> {service.city}
              </p>
              <p>
                <strong>Price:</strong> ₹{service.price}
              </p>
              <p>
                <strong>Rating:</strong> {service.rating ?? "N/A"}
              </p>
              <div className="service-card-actions">
                <Link to={`/customer/service/${service.id}`} className="btn btn-primary">
                  View Details
                </Link>
                <button
                  className="btn btn-outline"
                  onClick={() => addToCart(service)}
                  disabled={isServiceInCart(service.id)}
                >
                  {isServiceInCart(service.id) ? "Added to Bag" : "Add to Bag"}
                </button>
                {service.vendorId && (
                  <button
                    className={isVendorSaved(service.vendorId) ? "btn btn-primary" : "btn btn-outline"}
                    onClick={() =>
                      toggleSaveVendor({
                        vendorId: service.vendorId,
                        vendorName: service.vendorName || `Vendor ${service.vendorId}`,
                      })
                    }
                  >
                    {isVendorSaved(service.vendorId) ? "Saved" : "Save Vendor"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="service-list-page">
      <CustomerHeader title="Services" />
      <section className="dashboard-grid customer-dashboard-grid service-quick-actions">
        {quickActions.map((action) => (
          <div className="dashboard-card action-card" key={action.title}>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
            <Link to={action.to} className="btn btn-outline dashboard-card-action">
              {action.button}
            </Link>
          </div>
        ))}
      </section>
      <div className="filter-panel">
        <div className="filter-row">
          <div className="filter-field">
            <label>City</label>
            <input
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City"
            />
          </div>
          <div className="filter-field">
            <label>Category</label>
            <input
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Category"
            />
          </div>
          <div className="filter-field">
            <label>Min Budget</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
              />
          </div>
          <div className="filter-field">
            <label>Max Budget</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="0"
              />
          </div>
          <div className="filter-field">
            <label>Min Rating</label>
            <input
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
            <label>Available Date</label>
            <input
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
      </div>

      {renderServiceCards()}
    </div>
  );
};

export default ServiceList;
