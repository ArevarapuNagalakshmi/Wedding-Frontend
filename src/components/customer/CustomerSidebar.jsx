import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ConfirmModal from "../common/ConfirmModal";
import "../../styles/Sidebar.css";
import "../../styles/Dashboard.css";

const CustomerSidebar = ({ compact = false, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext) || {};
  const [collapsed, setCollapsed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const handler = () => setMobileVisible((visible) => !visible);
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  const handleLogoutConfirm = () => {
    try {
      if (logout) logout();
    } catch (err) {
      console.warn("Logout failed", err);
    }
    setConfirmOpen(false);
    navigate("/login");
  };

  const handleLogout = () => setConfirmOpen(true);

  const isActive = (path) => {
    if (path === "/customer") return location.pathname === "/customer";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const mainMenu = [
    { label: "Dashboard", icon: "dashboard", to: "/customer", exact: true },
    { label: "Saved Vendors", icon: "favorite_border", to: "/customer/saved-vendors" },
    { label: "Bookings", icon: "event", to: "/customer/bookings" },
    { label: "Shopping Bag", icon: "shopping_bag", to: "/customer/cart" },
  ];

  return (
    <aside className={`sidebar customer-sidebar ${collapsed ? "collapsed" : ""} ${mobileVisible ? "show-mobile" : ""} ${className}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">💍</div>
        <div className="menu-text">
          <h2>Plan-E</h2>
          <span>Customer hub</span>
        </div>
        <button
          className="sidebar-collapse-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
          type="button"
        >
          <span className="material-icons">{collapsed ? "chevron_right" : "chevron_left"}</span>
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="sidebar-item-group">
            <div className="menu-section-title">Primary</div>
            <Link to="/customer" className={`sidebar-item ${isActive("/customer") ? "active" : ""}`}>
              <span className="sidebar-icon material-icons">dashboard</span>
              <span className="sidebar-label">Dashboard</span>
            </Link>

            <button
              type="button"
              className={`sidebar-item ${isActive("/customer/services") ? "active" : ""}`}
              onClick={() => {
                if (collapsed) setCollapsed(false);
                setOpenMenu((m) => (m === "services" ? null : "services"));
              }}
              aria-expanded={openMenu === "services"}
            >
              <span className="sidebar-icon material-icons">search</span>
              <span className="sidebar-label">Services</span>
              <span className={`sidebar-item-caret ${openMenu === "services" ? "group-toggle-rotated" : ""}`}>
                <span className="material-icons">{openMenu === "services" ? "expand_less" : "expand_more"}</span>
              </span>
            </button>
            <div className={`sidebar-submenu ${openMenu === "services" ? "show" : ""} ${collapsed ? "collapsed" : ""}`}>
              <Link to="/customer/services" className="submenu-item" onClick={() => setOpenMenu(null)}>
                Browse Services
              </Link>
              <Link to="/customer/services" className="submenu-item" onClick={() => setOpenMenu(null)}>
                Planning Tips
              </Link>
              <Link to="/customer/profile" className="submenu-item" onClick={() => setOpenMenu(null)}>
                My Profile
              </Link>
            </div>

            {mainMenu.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-item ${isActive(item.to) ? "active" : ""}`}
                onClick={() => setOpenMenu(null)}
              >
                <span className="sidebar-icon material-icons">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout} type="button">
          <span className="sidebar-icon material-icons">logout</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Sign out"
        message="Are you sure you want to sign out?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </aside>
  );
};

export default CustomerSidebar;
