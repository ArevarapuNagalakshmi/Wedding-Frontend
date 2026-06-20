import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const VendorHeader = ({ businessInitials = "VD" }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="vendor-dashboard-topbar">
      <div className="vendor-brand">
        <div className="vendor-logo">{businessInitials}</div>
        <div>
          <h1>My Dashboard</h1>
          <p>Track chats, bookings, events, and live locations from one place.</p>
        </div>
      </div>

      <div className="vendor-dashboard-actions">
        <div className="vendor-actions-group">
          <Link to="/vendor/profile" className="btn btn-outline btn-small">
            View Profile
          </Link>
          <Link to="/vendor/services" className="btn btn-outline btn-small">
            My Services
          </Link>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </section>
  );
};

export default VendorHeader;
