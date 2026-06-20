import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/AdminSidebar.css";

const adminNav = [
  { key: "profile", label: "Dashboard", to: "/admin", iconClass: "fa fa-home" },
  { key: "vendors", label: "Vendor Approval", to: "/admin/vendors", iconClass: "fa fa-users" },
  { key: "reports", label: "Reports", to: "/admin/reports", iconClass: "fa fa-chart-bar" },
  { key: "bookings", label: "Bookings", to: "/admin/bookings", iconClass: "fa fa-calendar-alt" },
  { key: "settings", label: "Settings", to: "/admin/settings", iconClass: "fa fa-cog" },
];

const AdminSidebar = ({ admin, activeMenu, onSelect }) => {
  const { logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const handler = () => setMobileOpen(v => !v);
    window.addEventListener('toggleSidebar', handler);
    return () => window.removeEventListener('toggleSidebar', handler);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Modern Icon-Based Sidebar */}
      <aside className={`admin-sidebar-modern ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo/Brand Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">👑</div>
            <span className="logo-text">Admin</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          {adminNav.map((item) => {
            const isActive = activeMenu === item.key;
            
            return onSelect ? (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <div className="nav-icon-wrapper">
                  <i className={item.iconClass} aria-hidden="true" />
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: active }) => `nav-item ${active ? 'active' : ''}`}
                title={item.label}
              >
                <div className="nav-icon-wrapper">
                  <i className={item.iconClass} aria-hidden="true" />
                </div>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="sidebar-footer">
          <button 
            onClick={logout}
            className="logout-btn"
            title="Logout"
            type="button"
          >
            <div className="nav-icon-wrapper">
              <FaSignOutAlt />
            </div>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
