import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "../../styles/Navbar.css";

const ServicesMenu = ({ role = "GUEST", onNavigate = () => {} }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const items =
    role === "VENDOR"
      ? [
          { label: "Browse Services", to: "/vendor/services" },
          { label: "Planning Tips", to: "/planning-tips" },
          { label: "My Profile", to: "/vendor/profile" },
        ]
      : role === "CUSTOMER"
      ? [
          { label: "Browse Services", to: "/customer/services" },
          { label: "Planning Tips", to: "/planning-tips" },
          { label: "My Profile", to: "/customer/profile" },
        ]
      : [
          { label: "Browse Services", to: "/login" },
          { label: "Planning Tips", to: "/planning-tips" },
          { label: "Login", to: "/login" },
          { label: "Register", to: "/register" },
        ];

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  const handleSelect = (e) => {
    // close menu when a link is clicked
    setOpen(false);
    onNavigate();
  };

  return (
    <div className="services-menu" ref={menuRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        className="services-menu-toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open service menu"
      >
        <span className="services-menu-icon"><FiSearch /></span>
        <span className="services-menu-label">Services</span>
        <span className="services-menu-caret">▾</span>
      </button>

      {open && (
        <ul className="services-menu-list" role="menu">
          {items.map((it) => (
            <li key={it.label} role="none">
              <Link
                to={it.to}
                role="menuitem"
                className="services-menu-item"
                onClick={handleSelect}
              >
                <span className="services-menu-item-title">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesMenu;
