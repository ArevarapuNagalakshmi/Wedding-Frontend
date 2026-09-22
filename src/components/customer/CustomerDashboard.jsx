import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../../styles/Home.css";
import CustomerPageLayout from "./CustomerPageLayout";
import CustomerVendorCategories from "./CustomerVendorCategories";
import { getDashboardMetrics, getRecentBookings, getSavedVendors } from "../../api/customerApi";
import { searchServices } from "../../api/serviceApi";
import { getVendorById } from "../../api/vendorApi";

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: { totalBookings: 0, upcomingBookings: 0, completedBookings: 0, savedVendors: 0 },
    recentBookings: [],
    savedVendors: [],
  });
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [metricsRes, bookingsRes, vendorsRes] = await Promise.all([
          getDashboardMetrics(),
          getRecentBookings(5),
          getSavedVendors(6),
        ]);

        const metricsPayload = metricsRes?.data?.data || metricsRes?.data || {};
        const bookingsPayload = bookingsRes?.data?.data || bookingsRes?.data || [];
        const vendorsPayload = vendorsRes?.data?.data || vendorsRes?.data || [];

        setDashboardData({
          metrics: metricsPayload,
          recentBookings: bookingsPayload,
          savedVendors: vendorsPayload,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedVendors = async () => {
      try {
        const response = await searchServices({ category: "Photography" });
        const services = Array.isArray(response?.data) ? response.data.slice(0, 4) : [];

        const vendorProfiles = await Promise.all(
          services.map(async (service) => {
            const vendorId = service.vendorId || service.vendor?.id;
            const fallbackVendor = {
              id: vendorId || service.id,
              businessName: service.vendorName || "Featured Photographer",
              description: service.description || "Professional wedding photographer with a polished portfolio.",
              responseTime: service.category === "Photography" ? "10+ years of wedding photography experience" : "Experienced wedding professional",
              pricingRange: service.price ? `Starting from ₹${service.price}` : "Custom packages available",
            };

            if (!vendorId) return { ...fallbackVendor, serviceName: service.name, servicePrice: service.price };

            try {
              const vendorResponse = await getVendorById(vendorId);
              const vendor = vendorResponse?.data || fallbackVendor;
              return {
                id: vendor.id || vendorId,
                vendorId,
                serviceName: service.name,
                servicePrice: service.price,
                businessName: vendor.businessName || vendor.name || fallbackVendor.businessName,
                description: vendor.description || fallbackVendor.description,
                responseTime: vendor.responseTime || fallbackVendor.responseTime,
                pricingRange: vendor.pricingRange || fallbackVendor.pricingRange,
              };
            } catch (vendorErr) {
              console.error("Failed to load featured vendor", vendorErr);
              return { ...fallbackVendor, serviceName: service.name, servicePrice: service.price };
            }
          })
        );

        setFeaturedVendors(vendorProfiles);
      } catch (vendorErr) {
        console.error("Failed to load featured vendors:", vendorErr);
      }
    };

    fetchDashboardData();
    fetchFeaturedVendors();
  }, []);
  const quickActions = [
    {
      title: "Browse Services",
      description: "Discover curated wedding vendor packages with reviews and pricing.",
      button: "Explore now",
      to: "/customer/services",
      variant: "primary",
      icon: "🛍️",
      tag: "New picks",
    },
    {
      title: "My Bookings",
      description: "View your confirmed bookings, upcoming events, and reservation details.",
      button: "View bookings",
      to: "/customer/bookings",
      variant: "outline",
      icon: "📅",
      tag: "Upcoming",
    },
    {
      title: "Saved Vendors",
      description: "Keep a shortlist of trusted vendors for your wedding planning.",
      button: "Browse vendors",
      to: "/customer/saved-vendors",
      variant: "outline",
      icon: "💝",
      tag: "Favorites",
    },
    {
      title: "Planning Tips",
      description: "Get expert advice on how to manage vendor quotes, timelines, and budgets.",
      button: "Get started",
      to: "/customer/services",
      variant: "outline",
      icon: "💡",
      tag: "Advice",
    },
    {
      title: "My Profile",
      description: "Save your wedding preferences, contact details, and planning timeline in one place.",
      button: "Edit profile",
      to: "/customer/profile",
      variant: "outline",
      icon: "🧾",
      tag: "Preferences",
    },
  ];

  const sidebarLinks = quickActions.map((action) => ({
    label: action.title,
    description: action.description,
    to: action.to,
  }));

  return (
    <CustomerPageLayout
      title="Customer Dashboard"
      showLogout={true}
      className="customer-dashboard-page customer-dashboard-layout"
    >
          {error && (
            <div className="error-banner" style={{ 
              padding: "12px 16px", 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffc107", 
              borderRadius: "8px", 
              color: "#856404",
              marginBottom: "20px"
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ 
              padding: "40px", 
              textAlign: "center", 
              color: "#666" 
            }}>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <>
          <section className="customer-hero-panel">
            <div className="customer-hero-copy">
              <span className="dashboard-badge">Wedding planning hub</span>
              <h1>Plan every detail in a calm, modern workspace.</h1>
              <p>
                Connect with trusted vendors, manage bookings, and stay on top of your wedding timeline from one polished dashboard.
              </p>

              <div className="customer-hero-actions">
                <Link to="/customer/services" className="btn btn-primary">
                  Browse Services
                </Link>
                <Link to="/customer/bookings" className="btn btn-outline">
                  My Bookings
                </Link>
              </div>

              <div className="hero-key-metrics">
                <div className="customer-metric-card">
                  <span>Total Bookings</span>
                  <strong>{dashboardData.metrics.totalBookings || 0}</strong>
                </div>
                <div className="customer-metric-card">
                  <span>Upcoming</span>
                  <strong>{dashboardData.metrics.upcomingBookings || 0}</strong>
                </div>
                <div className="customer-metric-card">
                  <span>Saved Vendors</span>
                  <strong>{dashboardData.metrics.savedVendors || 0}</strong>
                </div>
              </div>
            </div>

            <aside className="customer-hero-visual">
              <div className="visual-panel">
                <div className="visual-panel-header">
                  <span className="visual-pill">Today at a glance</span>
                  <strong>{dashboardData.recentBookings.length} upcoming</strong>
                </div>
                <p>
                  Everything you need to stay on schedule: upcoming bookings, saved vendors, and priority actions in one refined view.
                </p>

                <div className="visual-metrics">
                  <span className="visual-chip">✓ Top vendor matches</span>
                  <span className="visual-chip">📅 Next event scheduled</span>
                  <span className="visual-chip">💡 Planning tips ready</span>
                  <span className="visual-chip">💰 Budget available</span>
                </div>
              </div>
            </aside>
          </section>

          <section className="dashboard-panel customer-highlight-panel" style={{ marginTop: "24px" }}>
            <div className="customer-highlight-content">
              <div>
                <span className="dashboard-badge">Top Category</span>
                <h3>Explore wedding photographers</h3>
                <p>Open the photography page with curated photographer cards that show names, experience, and package details.</p>
              </div>
              <Link to="/customer/services?category=Photography" className="btn btn-primary">
                Browse Photographers
              </Link>
            </div>
          </section>

          <section className="dashboard-grid customer-dashboard-grid">
            {quickActions.map((action) => (
              <article className="dashboard-card action-card customer-action-card" key={action.title}>
                <div className="customer-action-top">
                  <span className="customer-action-icon">{action.icon}</span>
                  <span className="customer-action-tag">{action.tag}</span>
                </div>
                <div className="dashboard-card-copy">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <Link
                  to={action.to}
                  className={`btn ${action.variant === "primary" ? "btn-primary" : "btn-outline"} dashboard-card-action`}
                >
                  {action.button}
                </Link>
              </article>
            ))}
          </section>

          <CustomerVendorCategories />

          {featuredVendors.length > 0 && (
            <section className="dashboard-panel" style={{ marginTop: "24px" }}>
              <div className="customer-hero-copy" style={{ marginBottom: "16px" }}>
                <span className="dashboard-badge">Featured photographers</span>
                <h3 style={{ marginTop: "8px", marginBottom: "6px" }}>Meet trusted wedding photographers on your home page</h3>
                <p style={{ margin: 0, color: "#5b6472" }}>
                  Browse their profile details, experience, and packages directly from the customer dashboard.
                </p>
              </div>

              <div className="dashboard-grid customer-dashboard-grid">
                {featuredVendors.map((vendor) => (
                  <article className="dashboard-card action-card customer-action-card" key={vendor.id}>
                    <div className="customer-action-top">
                      <span className="customer-action-icon">📸</span>
                      <span className="customer-action-tag">Photography</span>
                    </div>
                    <div className="dashboard-card-copy">
                      <h3>{vendor.businessName}</h3>
                      <p><strong>About:</strong> {vendor.description}</p>
                      <p><strong>Experience:</strong> {vendor.responseTime}</p>
                      <p><strong>Service:</strong> {vendor.serviceName} • {vendor.pricingRange}</p>
                    </div>
                    <Link to={vendor.vendorId ? `/vendor/${vendor.vendorId}` : "/customer/services"} className="btn btn-outline dashboard-card-action">
                      View profile
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="dashboard-panel customer-insights-panel">
            <article className="insight-card">
              <h3>Your planning hub</h3>
              <div className="customer-meta-list">
                <div>
                  <span>Next booking</span>
                  <strong>
                    {dashboardData.recentBookings.length > 0
                      ? new Date(dashboardData.recentBookings[0].date).toLocaleDateString()
                      : "No bookings yet"}
                  </strong>
                </div>
                <div>
                  <span>Saved shortlist</span>
                  <strong>{dashboardData.metrics.savedVendors || 0} vendors</strong>
                </div>
                <div>
                  <span>Planner status</span>
                  <strong>{dashboardData.metrics.upcomingBookings > 0 ? "Active" : "Ready to start"}</strong>
                </div>
              </div>
            </article>
            <article className="insight-card insight-highlight">
              <h3>Ready to book</h3>
              <p>
                Lock in your preferred vendors now to make sure the best wedding dates stay open.
              </p>
              <ul className="customer-checklist">
                <li>✓ Confirm vendor preferences</li>
                <li>✓ Review pricing packages</li>
                <li>✓ Schedule site visits</li>
              </ul>
            </article>
          </section>
            </>
          )}
    </CustomerPageLayout>
  );
};

export default CustomerDashboard;
