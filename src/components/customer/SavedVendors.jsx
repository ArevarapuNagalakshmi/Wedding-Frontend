import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "../../styles/Dashboard.css";
import "../../styles/SavedVendors.css";
import CustomerPageLayout from "./CustomerPageLayout";

const SavedVendors = () => {
  const { savedVendors, toggleSaveVendor } = useContext(CartContext);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "SV";
  };

  const savedCount = savedVendors.length;

  return (
    <CustomerPageLayout
      title="Saved Vendors"
      className="customer-saved-vendors-page"
    >
      <section className="customer-hero-panel saved-vendors-hero">
          <div className="customer-hero-copy">
            <span className="dashboard-badge">Saved Vendors</span>
            <h1>Keep your favorite vendors close at hand.</h1>
            <p>Your saved vendors will appear here so you can return to them quickly when planning.</p>
          </div>
        </section>

        <div className="saved-vendors-summary">
          <div className="saved-vendors-stat">
            <h3>{savedCount}</h3>
            <p>Saved vendors bookmarked for your wedding plans.</p>
          </div>
          <div className="saved-vendors-stat">
            <h3>{savedCount > 0 ? savedCount : "—"}</h3>
            <p>Total vendor profiles you have saved.</p>
          </div>
          <div className="saved-vendors-stat">
            <h3>{savedCount > 0 ? "Ready" : "Start"}</h3>
            <p>{savedCount > 0 ? "Compare details and contact them when you are ready." : "Browse services and save vendors you love."}</p>
          </div>
        </div>

        {savedVendors.length === 0 ? (
          <div className="saved-vendors-empty-state">
            <h3>No saved vendors yet</h3>
            <p>Browse wedding services and tap Save Vendor to bookmark the vendors you like.</p>
            <div className="saved-vendor-actions">
              <Link className="btn btn-primary" to="/customer/services">
                Browse Services
              </Link>
            </div>
          </div>
        ) : (
          <div className="saved-vendors-grid">
            {savedVendors.map((vendor) => {
              const vendorId = vendor.vendorId || vendor.id || vendor._id || "";
              const vendorName = vendor.vendorName || vendor.name || `Vendor ${vendorId}`;

              return (
                <div className="saved-vendor-card" key={vendorId || vendorName}>
                  <div className="saved-vendor-card-header">
                    <div className="saved-vendor-avatar">{getInitials(vendorName)}</div>
                    <div>
                      <h4>{vendorName}</h4>
                      <p className="saved-vendor-id">ID: {vendorId}</p>
                    </div>
                  </div>
                  <p className="saved-vendor-meta">
                    This vendor is saved so you can review their profile quickly during planning.
                  </p>
                  <div className="saved-vendor-actions">
                    <Link to={`/vendor/${vendorId}`} className="btn btn-outline">
                      View profile
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => toggleSaveVendor({ vendorId, vendorName })}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CustomerPageLayout>
    );
};

export default SavedVendors;
