import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SIDEBAR_NAV_ITEMS } from "./vendorSidebarConfig";
import "../../styles/VendorSidebar.css";

/**
 * VendorProfile Section Component
 * Displays vendor avatar and basic info at top of sidebar
 */
const VendorProfileSection = ({ vendor }) => {
  const getInitials = (name) => {
    if (!name) return "VP";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  if (!vendor) {
    return (
      <div className="sidebar-profile">
        <div className="profile-avatar">VP</div>
        <div className="profile-info">
          <p className="profile-name">Loading...</p>
          <p className="profile-title">Vendor Portal</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(vendor.businessName || vendor.name);

  return (
    <div className="sidebar-profile">
      <div className="profile-avatar">{initials}</div>
      <div className="profile-info">
        <p className="profile-name">{vendor.businessName || vendor.name || "Vendor"}</p>
        <p className="profile-title">Vendor panel</p>
      </div>
    </div>
  );
};

/**
 * Search Box Component
 * Simple search input for sidebar
 */
const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className="sidebar-search">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
        aria-label="Search navigation"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

/**
 * NavItem Component
 * Renders a single text-based navigation item
 */
const NavItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
      title={item.description}
    >
      <span className="sidebar-item-icon">
        <Icon />
      </span>
      <span className="sidebar-item-label">{item.label}</span>
    </NavLink>
  );
};

/**
 * LogoutButton Component
 * Renders the logout button in the sidebar footer
 */
const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="sidebar-logout-btn"
      type="button"
      title="Sign out of your account"
    >
      <span className="logout-icon">⏻</span>
      <span className="logout-label">Sign Out</span>
    </button>
  );
};

/**
 * VendorSidebar Component
 * Main sidebar navigation for vendor dashboard
 * Features:
 * - Vendor profile section at top
 * - Search functionality
 * - Text-based navigation items
 * - Light, clean design with active state highlighting
 * - Logout button at bottom
 * - Responsive layout
 */
const VendorSidebar = ({ vendor }) => {
  const { logout } = useContext(AuthContext);

  const handleSearch = (searchTerm) => {
    // Add search functionality as needed
    console.log("Search:", searchTerm);
  };

  return (
    <aside className="vendor-sidebar" role="navigation" aria-label="Vendor dashboard navigation">
      {/* Vendor Profile Section */}
      <VendorProfileSection vendor={vendor} />

      {/* Search Box */}
      <SearchBox onSearch={handleSearch} />

      {/* Main Navigation */}
      <nav className="sidebar-nav-menu">
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className="sidebar-footer">
        <LogoutButton onLogout={logout} />
      </div>
    </aside>
  );
};

export default VendorSidebar;
