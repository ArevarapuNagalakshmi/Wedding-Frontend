import React, { useContext, useMemo, useState } from "react";
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
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar-container${isVendorArea ? " vendor-area" : ""}`}>
      <div className="navbar-brand-group">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-logo">💍</span>
          <div className="navbar-brand-text">
            <span className="navbar-title">Plan-E Weddings</span>
            <span className="navbar-subtitle">Modern planning hub</span>
          </div>
        </Link>

        <button
          className="navbar-burger"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className={`navbar-links${menuOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <button className="bg-toggle-button" onClick={onToggleBg} type="button">
          {normalBg ? <FaMoon /> : <FaSun />} {normalBg ? "Night mode" : "Day mode"}
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
                to={
                  currentRole === "ADMIN"
                    ? "/admin"
                    : currentRole === "VENDOR"
                    ? "/vendor/profile"
                    : "/customer"
                }
                onClick={closeMenu}
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
                onClick={closeMenu}
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
            <Link className="nav-button nav-secondary" to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link className="nav-button nav-secondary" to="/register" onClick={closeMenu}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
