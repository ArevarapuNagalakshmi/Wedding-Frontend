import React, { useContext, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../styles/Navbar.css";

const Navbar = ({ onToggleBg, normalBg }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const currentRole = token && role ? role : "GUEST";
  const isVendorArea = currentRole === "VENDOR" && location.pathname.startsWith("/vendor");

  const navLinks = useMemo(() => {
    const baseLinks = [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ];

    if (currentRole === "VENDOR") {
      return [
        ...baseLinks,
        { label: "Dashboard", to: "/vendor" },
        { label: "Services", to: "/vendor/services" },
        { label: "Profile", to: "/vendor/profile" },
      ];
    }

    if (currentRole === "CUSTOMER") {
      return [
        ...baseLinks,
        { label: "Dashboard", to: "/customer" },
        { label: "Services", to: "/customer/services" },
        { label: "Bookings", to: "/customer/bookings" },
      ];
    }

    if (currentRole === "ADMIN") {
      return [
        ...baseLinks,
        { label: "Admin", to: "/admin" },
        { label: "Reports", to: "/admin" },
      ];
    }

    return baseLinks;
  }, [currentRole]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`navbar-container${isVendorArea ? " vendor-area" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">💍</span>
          <div className="navbar-brand-text">
            <span className="navbar-title">Plan-E Weddings</span>
            <span className="navbar-subtitle">Vendor dashboard</span>
          </div>
        </Link>
      </div>

      <nav className="navbar-links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <button
          className="bg-toggle-button"
          title={normalBg ? "Switch to white background" : "Switch to normal background"}
          onClick={onToggleBg}
          aria-pressed={!normalBg}
        >
          {normalBg ? "Normal" : "White"}
        </button>
        {token && currentRole === "CUSTOMER" && (
          <span className="nav-badge">🛍️ {cartCount} item{cartCount === 1 ? "" : "s"}</span>
        )}

        {token ? (
          <div className="nav-account-dropdown">
            <button className="nav-account-button" type="button">
              <FaUserCircle /> Account
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link
                className="dropdown-item"
                to={currentRole === "ADMIN" ? "/admin" : currentRole === "VENDOR" ? "/vendor/profile" : "/customer"}
              >
                My Dashboard
              </Link>
              <Link
                className="dropdown-item"
                to={currentRole === "CUSTOMER" ? "/customer/profile" : currentRole === "VENDOR" ? "/vendor/profile" : "/"}
              >
                My Profile
              </Link>
              <button className="dropdown-item logout-button-menu" onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-actions">
            <Link className="nav-button nav-secondary" to="/login">
              Login
            </Link>
            <Link className="nav-button nav-secondary" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
