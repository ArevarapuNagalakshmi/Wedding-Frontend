import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Sidebar.css";

const Sidebar = ({ title = "Menu", links = [], children }) => {
  return (
    <aside className="sidebar-panel">
      <div className="sidebar-header">
        <h3>{title}</h3>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <Link key={l.to || l.label} to={l.to || "#"} className="sidebar-link">
            <div className="sidebar-link-title">{l.label}</div>
            {l.description && <div className="sidebar-link-desc">{l.description}</div>}
          </Link>
        ))}
      </nav>

      {children && <div className="sidebar-children">{children}</div>}
    </aside>
  );
};

export default Sidebar;
