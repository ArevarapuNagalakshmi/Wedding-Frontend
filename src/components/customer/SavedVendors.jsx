import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";

const SavedVendors = () => {
  const { savedVendors, toggleSaveVendor } = useContext(CartContext);

  return (
    <div className="dashboard-container customer-saved-vendors-page">
      <CustomerHeader title="Saved Vendors" />
      <section className="customer-hero-panel">
        <div className="customer-hero-copy">
          <span className="dashboard-badge">Saved Vendors</span>
          <h1>Keep your favorite vendors close at hand.</h1>
          <p>
            Your saved vendors will appear here so you can return to them quickly when planning.
          </p>
        </div>
      </section>

      {savedVendors.length === 0 ? (
        <div className="service-list-error">
          <h3>No saved vendors yet</h3>
          <p>Browse wedding services and tap Save Vendor to bookmark the vendors you like.</p>
          <Link className="btn btn-primary" to="/customer/services">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="saved-vendors-grid">
          {savedVendors.map((vendor) => (
            <div className="saved-vendor-card" key={vendor.vendorId}>
              <h4>{vendor.vendorName}</h4>
              <p>Vendor ID: {vendor.vendorId}</p>
              <button className="btn btn-outline" onClick={() => toggleSaveVendor(vendor)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedVendors;
