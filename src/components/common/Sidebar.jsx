import React from "react";
import { NavLink } from "react-router-dom";
import { FiSearch, FiBookmark, FiUser, FiCreditCard, FiCalendar } from "react-icons/fi";
import "../../styles/Sidebar.css";

const iconMap = {
  "Browse Services": FiSearch,
  "My Bookings": FiCalendar,
  "Saved Vendors": FiBookmark,
  "My Profile": FiUser,
  Billing: FiCreditCard,
};

const Sidebar = ({ title = "Menu", links = [], children }) => {
  return (
    <aside className="sidebar-panel sidebar-trendy">
      <div className="sidebar-header">
        <h3>{title}</h3>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => {
          const Icon = iconMap[l.label] || FiSearch;
          return (
            <NavLink
              key={l.to || l.label}
              to={l.to || "#"}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              <div className="sidebar-link-left">
                <Icon className="sidebar-icon" />
              </div>
              <div className="sidebar-link-body">
                <div className="sidebar-link-title">{l.label}</div>
                {l.description && <div className="sidebar-link-desc">{l.description}</div>}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {children && <div className="sidebar-children">{children}</div>}
    </aside>
  );
};

export default Sidebar;
