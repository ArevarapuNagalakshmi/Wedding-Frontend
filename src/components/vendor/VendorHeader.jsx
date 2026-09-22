import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getMyServices } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import "../../styles/Dashboard.css";

const VendorHeader = ({ businessInitials = "VD" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [serviceSearch, setServiceSearch] = useState("");
  const [services, setServices] = useState([]);
  const [vendorCity, setVendorCity] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const initials = String(businessInitials || "VD")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const profileResponse = await getVendorProfile();
        const profile = profileResponse?.data || {};
        setVendorCity(profile.city || profile.address || "");

        if (profile.id) {
          const servicesResponse = await getMyServices(profile.id);
          setServices(Array.isArray(servicesResponse?.data) ? servicesResponse.data : []);
        }
      } catch (error) {
        setServices([]);
      }
    };

    loadServices();
  }, []);

  const matchingServices = serviceSearch.trim()
    ? services.filter((service) => {
        const searchValue = serviceSearch.trim().toLowerCase();
        return [service.name, service.description, service.category, service.city]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchValue));
      }).slice(0, 6)
    : [];

  const handleServiceSearch = (event) => {
    event.preventDefault();
    setSearchOpen(Boolean(serviceSearch.trim()));
  };

  return (
    <header className="vendor-header-shell">
      <div className="vendor-header-topbar">
        <div className="vendor-branding">
          <div className="vendor-app-icon">{initials}</div>

          <div className="vendor-brand-copy">
            <div className="vendor-brand-title">PLAN E WEDDINGS</div>
            <div className="vendor-brand-subtitle">Event Planning Made Easy</div>
          </div>
        </div>

        <nav className="vendor-main-nav" aria-label="Vendor navigation">
          <Link to="/vendor" className={isActive("/vendor") ? "active" : ""}>
            Home
          </Link>

          <Link to="/vendor/dashboard" className={isActive("/vendor/dashboard") ? "active" : ""}>
            Dashboard
          </Link>

          <div className="vendor-services-dropdown">
            <Link to="/vendor/services" className={isActive("/vendor/services") ? "active" : ""}>
              Services
            </Link>
            <span className="vendor-dropdown-caret" aria-hidden="true">▼</span>
          </div>

          <Link to="/vendor/profile" className={isActive("/vendor/profile") ? "active" : ""}>
            Profile
          </Link>
        </nav>

        <div className="vendor-header-tools">
          <form className="vendor-search-wrap" onSubmit={handleServiceSearch}>
            <input
              type="text"
              placeholder="Search services..."
              aria-label="Search services"
              value={serviceSearch}
              onChange={(event) => {
                setServiceSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(Boolean(serviceSearch.trim()))}
            />
            <button type="submit">Search</button>
            {searchOpen && serviceSearch.trim() && (
              <div className="vendor-search-results">
                {matchingServices.length > 0 ? (
                  matchingServices.map((service) => (
                    <button
                      type="button"
                      className="vendor-search-result"
                      key={service.id || service._id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/vendor/edit-service/${service.id || service._id}`);
                      }}
                    >
                      <strong>{service.name || "Wedding service"}</strong>
                      <span>{service.city || vendorCity || "Location not set"}</span>
                    </button>
                  ))
                ) : (
                  <div className="vendor-search-empty">No matching services found.</div>
                )}
              </div>
            )}
          </form>

          <div className="vendor-profile-pill">
            <span className="vendor-mini-icon">{initials}</span>
            <span className="vendor-mini-caret" aria-hidden="true">⌄</span>
          </div>

          <button type="button" className="vendor-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
