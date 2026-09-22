import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const CustomerHeader = ({ title = "", showLogout = false }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext) || {};

  const handleLogout = () => {
    try {
      if (logout) logout();
    } catch (err) {
      console.warn("Logout failed", err);
    }
    navigate("/login");
  };

  return (
    <div className="customer-header">
      <div className="customer-header-left">
        <h2 className="customer-header-title">{title}</h2>
        <Link to="/customer" className="customer-header-subtle">
          Home
        </Link>
      </div>

      <div className="customer-header-right">
        {showLogout && (
          <button className="customer-logout-btn" onClick={handleLogout} type="button">
            <span className="material-icons">logout</span>
            <span className="logout-text">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;
