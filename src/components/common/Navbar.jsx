import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../styles/Navbar.css";

const Navbar = ({ onToggleBg, normalBg }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const currentRole = token && role ? role : "GUEST";
  const isVendorArea = currentRole === "VENDOR" && location.pathname.startsWith("/vendor");

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

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

  const closeAll = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setAccountOpen(false);
  };

  const toggleAccountMenu = () => {
    setAccountOpen((prev) => !prev);
  };

  const handleLogout = () => {
    closeAll();
    logout();
    navigate("/login");
  };

  return (
    <header className={`navbar-container${isVendorArea ? " vendor-area" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={closeAll}>
          <span className="navbar-logo">💍</span>
          <div className="navbar-brand-text">
            <span className="navbar-title">Plan-E Weddings</span>
            <span className="navbar-subtitle">Event planning made easy</span>
          </div>
        </Link>
        <button
          className="navbar-burger"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav
        id="primary-navigation"
        className={`navbar-nav${menuOpen ? " open" : ""}`}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeAll}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="navbar-right">
        <button className="bg-toggle-button" onClick={onToggleBg} type="button">
          {normalBg ? <FaMoon /> : <FaSun />}
          <span className="button-text">{normalBg ? "Night" : "Day"}</span>
        </button>

        {token && currentRole === "CUSTOMER" && (
          <span className="nav-badge">🛍️ {cartCount}</span>
        )}

        {token ? (
          <div className="nav-account-dropdown">
            <button
              className="nav-account-button"
              type="button"
              aria-expanded={accountOpen}
              aria-haspopup="true"
              onClick={toggleAccountMenu}
            >
              <FaUserCircle /> Account
            </button>
            <div className={`dropdown-menu${accountOpen ? " open" : ""}`}>
              <Link
                className="dropdown-item"
                to={
                  currentRole === "ADMIN"
                    ? "/admin"
                    : currentRole === "VENDOR"
                    ? "/vendor/profile"
                    : "/customer"
                }
                onClick={closeAll}
              >
                My Dashboard
              </Link>
              <Link
                className="dropdown-item"
                to={
                  currentRole === "CUSTOMER"
                    ? "/customer/profile"
                    : currentRole === "VENDOR"
                    ? "/vendor/profile"
                    : "/"
                }
                onClick={closeAll}
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
            <Link className="nav-button nav-secondary" to="/login" onClick={closeAll}>
              Login
            </Link>
            <Link className="nav-button nav-secondary" to="/register" onClick={closeAll}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
