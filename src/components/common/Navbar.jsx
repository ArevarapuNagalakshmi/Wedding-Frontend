import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import ServicesMenu from "./ServicesMenu";

import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  const { token, role, logout, displayName } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const currentRole = token && role ? role : "GUEST";
  const isCustomer = currentRole === "CUSTOMER";
  const guestDestination = "/login";

  useEffect(() => {
    const updateCompact = () => setIsCompact(window.scrollY > 60);
    window.addEventListener("scroll", updateCompact);
    return () => window.removeEventListener("scroll", updateCompact);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    // Focus the first menu item when opened
    const first = itemRefs.current && itemRefs.current[0];
    first?.focus();

    const onKeyDown = (e) => {
      if (!menuRef.current) return;
      const items = itemRefs.current.filter(Boolean);
      const activeIndex = items.indexOf(document.activeElement);

      if (e.key === "Escape") {
        setAccountOpen(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = items[(activeIndex + 1) % items.length];
        next?.focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = items[(activeIndex - 1 + items.length) % items.length];
        prev?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [accountOpen]);

  useEffect(() => {
    if (accountOpen) {
      // focus first menu item when opening
      setTimeout(() => {
        if (itemRefs.current && itemRefs.current[0]) itemRefs.current[0].focus();
      }, 0);
    }
  }, [accountOpen]);

  const focusItem = (index) => {
    const el = itemRefs.current[index];
    if (el) el.focus();
  };

  const onProfileToggleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAccountOpen(true);
      setTimeout(() => {
        if (itemRefs.current && itemRefs.current[0]) itemRefs.current[0].focus();
      }, 0);
    }
  };

  const navLinks = useMemo(() => {
    const commonLinks = [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ];

    switch (currentRole) {
      case "CUSTOMER":
        return [
          ...commonLinks,
          { label: "Services", to: "/customer/services" },
        ];
      case "VENDOR":
        return [
          ...commonLinks,
          { label: "Dashboard", to: "/vendor" },
          { label: "Services", to: "/vendor/services" },
          { label: "Profile", to: "/vendor/profile" },
        ];
      case "ADMIN":
        return [...commonLinks, { label: "Dashboard", to: "/admin" }];
      default:
        return commonLinks;
    }
  }, [currentRole]);

  const onMenuKeyDown = (e) => {
    const { key } = e;
    const nodes = itemRefs.current || [];
    const idx = nodes.indexOf(document.activeElement);

    if (key === "Escape") {
      setAccountOpen(false);
      return;
    }

    if (key === "ArrowDown") {
      e.preventDefault();
      const next = idx === -1 ? 0 : Math.min(nodes.length - 1, idx + 1);
      focusItem(next);
    } else if (key === "ArrowUp") {
      e.preventDefault();
      const prev = idx === -1 ? nodes.length - 1 : Math.max(0, idx - 1);
      focusItem(prev);
    } else if (key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (key === "End") {
      e.preventDefault();
      focusItem(nodes.length - 1);
    }
  };

  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  const handleLogout = () => {
    setMenuOpen(false);
    setAccountOpen(false);
    logout();
    navigate("/login");
  };

  const userDashboardLink =
    currentRole === "ADMIN"
      ? "/admin"
      : currentRole === "VENDOR"
      ? "/vendor"
      : "/customer"; // customers should go to their customer home

  const userProfileLink =
    currentRole === "CUSTOMER" ? "/customer/profile" : "/vendor/profile";

  return (
    <header className={`navbar ${isCompact ? "navbar--compact" : ""}`}>
      <div className="navbar__start">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">💍</span>
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">PLAN-E WEDDINGS</span>
            <span className="navbar__brand-subtitle">Event Planning Made Easy</span>
          </div>
        </Link>

        <button
          className="navbar__toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
        {navLinks.map((link) => {
          if (link.label === "Services") {
            return (
              <div key="services-menu" className="navbar__link navbar__link--services">
                <ServicesMenu role={currentRole} onNavigate={() => setMenuOpen(false)} />
              </div>
            );
          }

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="navbar__end">
        <form
          className="navbar__search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = (searchQuery || "").trim();
            if (!q) return;
            setSearchQuery("");
            const destination = isCustomer ? "/customer/services" : guestDestination;
            navigate(`${destination}?q=${encodeURIComponent(q)}`);
            setMenuOpen(false);
          }}
        >
          <input
            aria-label="Search services"
            className="navbar__search-input"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar__search-button">Search</button>
        </form>
        

        {token && currentRole === "CUSTOMER" && (
          <Link to="/customer/cart" className="navbar__icon-button">
            <FaShoppingCart />
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
        )}

        {!token ? (
          <div className="navbar__actions">
            <Link to="/login" className="navbar__button navbar__button--secondary">
              Login
            </Link>
            <Link to="/register" className="navbar__button navbar__button--primary">
              Register
            </Link>
          </div>
        ) : (
          <div className="navbar__profile" ref={accountRef}>
            <button
              type="button"
              className="navbar__profile-toggle"
              onClick={() => setAccountOpen((value) => !value)}
              onKeyDown={onProfileToggleKeyDown}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
            >
              {initials ? (
                <span className="navbar__avatar">{initials}</span>
              ) : (
                <FaUserCircle className="navbar__avatar-icon" />
              )}
              <FaChevronDown className="navbar__chevron" />
            </button>

            {accountOpen && (
              <div
                className="navbar__profile-menu"
                ref={menuRef}
                role="menu"
                aria-label="Account menu"
                onKeyDown={onMenuKeyDown}
              >
                {currentRole === "CUSTOMER" && (
                  <>
                    <Link
                      to="/customer/bookings"
                      className="navbar__profile-item"
                      role="menuitem"
                      tabIndex={-1}
                      ref={(el) => (itemRefs.current[0] = el)}
                      onClick={() => setAccountOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/customer/saved-vendors"
                      className="navbar__profile-item"
                      role="menuitem"
                      tabIndex={-1}
                      ref={(el) => (itemRefs.current[1] = el)}
                      onClick={() => setAccountOpen(false)}
                    >
                      Saved Vendors
                    </Link>
                    <div className="navbar__profile-separator" />
                  </>
                )}
                <Link
                  to={userDashboardLink}
                  className="navbar__profile-item"
                  role="menuitem"
                  tabIndex={-1}
                  ref={(el) => (itemRefs.current[itemRefs.current.length] = el)}
                  onClick={() => setAccountOpen(false)}
                >
                  {currentRole === "CUSTOMER" ? "Home" : "Dashboard"}
                </Link>
                <Link
                  to={userProfileLink}
                  className="navbar__profile-item"
                  role="menuitem"
                  tabIndex={-1}
                  ref={(el) => (itemRefs.current[itemRefs.current.length] = el)}
                  onClick={() => setAccountOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="navbar__profile-item navbar__profile-item--button"
                  role="menuitem"
                  tabIndex={-1}
                  ref={(el) => (itemRefs.current[itemRefs.current.length] = el)}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
