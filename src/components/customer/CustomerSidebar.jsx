import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ConfirmModal from "../common/ConfirmModal";
import "../../styles/Sidebar.css";
import "../../styles/Dashboard.css";

const CustomerSidebar = ({
  title = "Planning center",
  links,
  compact = false,
  className = "",
  showLogout = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext) || {};
  const [collapsed, setCollapsed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const handler = () => setMobileVisible((v) => !v);
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
    if (!path) return false;
    if (path === "/customer") return location.pathname === "/customer";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const defaultMenu = [
    { key: "home", label: "Home", icon: "dashboard", to: "/customer" },
    { key: "services", label: "Browse Services", icon: "search", to: "/customer/services" },
    { key: "planning", label: "Planning Tips", icon: "school", to: "/planning-tips" },
    { key: "saved", label: "Saved Vendors", icon: "favorite_border", to: "/customer/saved-vendors" },
    { key: "bookings", label: "Bookings", icon: "event", to: "/customer/bookings" },
    { key: "cart", label: "Shopping Bag", icon: "shopping_bag", to: "/customer/cart" },
    { key: "profile", label: "My Profile", icon: "person", to: "/customer/profile" },
  ];

  const menu = links && links.length > 0 ? links.map((link, index) => ({
    key: link.key || `custom-${index}`,
    label: link.label,
    icon: link.icon || "arrow_right",
    to: link.to,
    children: link.children,
  })) : defaultMenu;

  const handleToggleMenu = (key) => {
    if (collapsed) setCollapsed(false);
    setOpenMenu((m) => (m === key ? null : key));
  };

  const onKeyToggle = (e, key) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleMenu(key);
    }
  };

  return (
    <aside
      className={`sidebar customer-sidebar ${collapsed ? "collapsed" : ""} ${mobileVisible ? "show-mobile" : ""} ${className}`}
    >
      <div className="sidebar-brand customer-sidebar-brand">
        <div className="sidebar-logo customer-sidebar-logo">💍</div>
        <div className="menu-text">
          <h2>Plan-E</h2>
          <span>Wedding planning hub</span>
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
        <div className="customer-sidebar-intro">
          <span className="customer-sidebar-pill">{title}</span>
          <p>Everything for your celebration, neatly organized.</p>
        </div>

        <nav className="sidebar-nav" aria-label="Customer navigation">
          <div className="sidebar-item-group">
            <div className="menu-section-title">Primary</div>

            {menu.map((m) => {
              if (m.children) {
                const open = openMenu === m.key;
                return (
                  <div key={m.key} className="sidebar-group">
                    <button
                      type="button"
                      className={`sidebar-item ${open || m.children.some((c) => isActive(c.to)) ? "active" : ""}`}
                      onClick={() => handleToggleMenu(m.key)}
                      onKeyDown={(e) => onKeyToggle(e, m.key)}
                      aria-expanded={open}
                      aria-controls={`submenu-${m.key}`}
                    >
                      <span className="sidebar-icon material-icons">{m.icon}</span>
                      <span className="sidebar-label">{m.label}</span>
                      <span className={`sidebar-item-caret ${open ? "group-toggle-rotated" : ""}`}>
                        <span className="material-icons">{open ? "expand_less" : "expand_more"}</span>
                      </span>
                    </button>

                    <div id={`submenu-${m.key}`} className={`sidebar-submenu ${open ? "show" : ""} ${collapsed ? "collapsed" : ""}`} role="menu" aria-label={m.label}>
                      {m.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`submenu-item ${isActive(child.to) ? "active" : ""}`}
                          onClick={() => setOpenMenu(null)}
                          aria-current={isActive(child.to) ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={m.key}
                  to={m.to}
                  className={`sidebar-item ${isActive(m.to) ? "active" : ""}`}
                  onClick={() => setOpenMenu(null)}
                  aria-current={isActive(m.to) ? "page" : undefined}
                >
                  <span className="sidebar-icon material-icons">{m.icon}</span>
                  <span className="sidebar-label">{m.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {showLogout && (
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout} type="button">
            <span className="sidebar-icon material-icons">logout</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      )}

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
