import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyServices } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import Loader from "../common/Loader";
import VendorDashboard from "./VendorDashboard";
import "../../styles/Dashboard.css";

const VendorHome = () => {
  const [vendor, setVendor] = useState(null);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendorHome = async () => {
      try {
        const profileResponse = await getVendorProfile();
        const profile = profileResponse?.data || null;
        setVendor(profile);

        if (profile?.id) {
          const servicesResponse = await getMyServices(profile.id);
          setServiceCount(Array.isArray(servicesResponse?.data) ? servicesResponse.data.length : 0);
        }
      } catch (error) {
        console.error("Unable to load vendor home", error);
      } finally {
        setLoading(false);
      }
    };

    loadVendorHome();
  }, []);

  if (loading) return <Loader />;

  const businessName = vendor?.businessName || "Your wedding business";
  const initials = businessName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="vendor-home-page">
      <section className="vendor-home-hero">
        <div className="vendor-home-hero-copy">
          <span className="vendor-home-kicker">Vendor home</span>
          <h1>Build a wedding business couples remember.</h1>
          <p>Present your best work, manage your services, and grow every enquiry from one place.</p>
          <div className="vendor-home-actions">
            <Link to="/vendor/dashboard" className="btn btn-primary">Open dashboard</Link>
            <Link to="/vendor/profile" className="btn btn-outline">Edit profile</Link>
          </div>
        </div>
        <div className="vendor-home-identity">
          <div className="vendor-home-avatar">{initials || "VD"}</div>
          <strong>{businessName}</strong>
          <span>{vendor?.city || "Add your service location"}</span>
        </div>
      </section>

      <section className="vendor-home-stats" aria-label="Vendor overview">
        <article><span>Services published</span><strong>{serviceCount}</strong><small>Keep your packages current</small></article>
        <article><span>Profile status</span><strong>{vendor ? "Live" : "Setup"}</strong><small>{vendor ? "Ready to be discovered" : "Create your profile"}</small></article>
        <article><span>Service area</span><strong>{vendor?.city || "Not set"}</strong><small>Help couples find you</small></article>
      </section>

      <section className="vendor-home-steps">
        <div className="vendor-home-section-heading">
          <div>
            <span className="vendor-home-kicker">Quick actions</span>
            <h2>Keep your storefront ready.</h2>
          </div>
          <Link to="/vendor/services" className="view-all-link">Manage services</Link>
        </div>
        <div className="vendor-home-action-grid">
          <Link to="/vendor/profile" className="vendor-home-action-card"><span className="vendor-home-action-number">01</span><strong>Complete your profile</strong><p>Add your story, location, pricing, and portfolio.</p></Link>
          <Link to="/vendor/add-service" className="vendor-home-action-card"><span className="vendor-home-action-number">02</span><strong>Publish a service</strong><p>Give couples a clear package they can understand and book.</p></Link>
          <Link to="/vendor/dashboard" className="vendor-home-action-card vendor-home-action-card-accent"><span className="vendor-home-action-number">03</span><strong>Review your day</strong><p>Check conversations, appointments, calendar, and locations.</p></Link>
        </div>
      </section>

      <section className="vendor-home-operations" aria-label="Vendor operations">
        <div className="vendor-home-section-heading">
          <div>
            <span className="vendor-home-kicker">Daily workspace</span>
            <h2>Stay close to every event.</h2>
          </div>
        </div>
        <VendorDashboard showMetrics={false} />
      </section>
    </div>
  );
};

export default VendorHome;
