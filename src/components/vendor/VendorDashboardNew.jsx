import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import { getMyServices } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import Loader from "../common/Loader";
import VendorLayout from "./VendorLayout";
import VendorHeader from "./VendorHeader";

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missingProfile, setMissingProfile] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const profileRes = await getVendorProfile();
      const servicesRes = await getMyServices(profileRes.data.id);
      setVendor(profileRes.data);
      setServices(servicesRes.data || []);
    } catch (err) {
      console.error("Unable to load vendor dashboard data", err);
      // If backend returns 404 (no profile yet), surface a clear CTA
      const status = err?.response?.status;
      if (status === 404) {
        setMissingProfile(true);
        setError("Vendor profile not found. Create your profile to get started.");
      } else {
        setError("Unable to load vendor information. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const vendorName = vendor?.businessName || "Vendor";
  const vendorLocation = vendor?.address || vendor?.city || vendor?.location || "Not set";

  if (loading) return <Loader />;

  return (
    <VendorLayout vendor={vendor}>
      <VendorHeader businessInitials={vendorName.slice(0, 2).toUpperCase()} />

      <section className="vendor-main-card">
        {error && <div className="vendor-dashboard-alert">{error}</div>}
        {missingProfile && (
          <div style={{ marginTop: 12 }}>
            <Link to="/vendor/profile" className="btn btn-primary">Create Vendor Profile</Link>
          </div>
        )}

        <div className="vendor-main-card-inner">
          <div className="main-card-left">
            <div className="badge">Manage your event services</div>
            <h2>Keep your service offerings up to date for every couple.</h2>
            <p>Use this profile to track income, manage bookings, and view event locations without missing any request.</p>
            <div className="hero-ctas">
              <Link to="/vendor/add-service" className="btn btn-primary large">ADD NEW SERVICE</Link>
              <Link to="/vendor/services" className="btn btn-outline">View All Services</Link>
            </div>
          </div>

          <aside className="main-card-right">
            <div className="meta-box">
              <span>Vendor</span>
              <strong>{vendorName}</strong>
            </div>
            <div className="meta-box">
              <span>Approval status</span>
              <strong>{vendor?.approved === false ? "Pending" : "Approved"}</strong>
            </div>
            <div className="meta-box">
              <span>Rating</span>
              <strong>{vendor?.rating || "N/A"}</strong>
            </div>
            <div className="meta-box">
              <span>Response time</span>
              <strong>{vendor?.response || "Not set"}</strong>
            </div>
            <div className="meta-box">
              <span>Location</span>
              <strong>{vendorLocation}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="vendor-summary-row">
        <article className="summary-card">
          <span className="summary-title">Total Services</span>
          <strong>{services.length}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-title">Vendor Status</span>
          <strong>{vendor?.approved === false ? "Pending Approval" : "Live"}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-title">Location</span>
          <strong>{vendorLocation}</strong>
        </article>
        <article className="summary-card summary-card-primary">
          <span className="summary-title">Quick Actions</span>
          <strong>Manage your services and profile</strong>
        </article>
      </section>

      <section className="service-overview">
        <div className="section-header">
          <div>
            <h2>Your Live Services</h2>
            <p>These service packages are visible to couples and can be updated anytime.</p>
          </div>
          <Link to="/vendor/add-service" className="view-all-link">Add new service</Link>
        </div>
        {services.length === 0 ? (
          <div className="service-preview-empty">
            <h3>No services added yet</h3>
            <p>Add your first wedding service now and start receiving more bookings.</p>
            <Link to="/vendor/add-service" className="btn btn-primary">Add Service</Link>
          </div>
        ) : (
          <div className="service-preview-grid">
            {services.map((service) => {
              const serviceId = service.id || service._id;
              return (
                <div key={serviceId} className="service-preview-card">
                  {service.imageUrls && service.imageUrls.length > 0 && (
                    <div className="service-image" style={{ marginBottom: 16 }}>
                      <img src={service.imageUrls[0]} alt={service.name} />
                    </div>
                  )}
                  <div className="service-card-header">
                    <h3>{service.name || "Untitled Service"}</h3>
                    <span className="service-price">₹{service.price || 0}</span>
                  </div>
                  <p>{service.description || "No description provided."}</p>
                  <div className="service-card-actions">
                    <Link to={`/vendor/edit-service/${serviceId}`} className="btn btn-outline">Edit</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </VendorLayout>
  );
};

export default VendorDashboard;
