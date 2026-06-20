import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";
import CustomerSidebar from "./CustomerSidebar";

const CustomerDashboard = () => {
  const quickActions = [
    {
      title: "Browse Services",
      description: "Discover curated wedding vendor packages with reviews and pricing.",
      button: "Explore now",
      to: "/customer/services",
    },
    {
      title: "My Bookings",
      description: "View your confirmed bookings, upcoming events, and reservation details.",
      button: "View bookings",
      to: "/customer/bookings",
    },
    {
      title: "Saved Vendors",
      description: "Keep a shortlist of trusted vendors for your wedding planning.",
      button: "Browse vendors",
      to: "/customer/saved-vendors",
    },
    {
      title: "Planning Tips",
      description: "Get expert advice on how to manage vendor quotes, timelines, and budgets.",
      button: "Get started",
      to: "/customer/services",
    },
    {
      title: "My Profile",
      description: "Save your wedding preferences, contact details, and planning timeline in one place.",
      button: "Edit profile",
      to: "/customer/profile",
    },
  ];

  return (
    <div className="dashboard-container customer-dashboard-page customer-dashboard-layout">
      <div className="customer-layout-with-sidebar">
        <CustomerSidebar />
        <main className="customer-main-panel">
          <CustomerHeader title="Customer Dashboard" showLogout={true} />

          <section className="customer-hero-panel">
            <div className="customer-hero-copy">
              <span className="dashboard-badge">Event Planner</span>
              <h1>Plan a modern wedding with clarity and confidence.</h1>
              <p>
                Connect with trusted vendors, manage bookings, and track your wedding journey from one polished dashboard.
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
                  <span>Trusted vendors</span>
                  <strong>24</strong>
                </div>
                <div className="customer-metric-card">
                  <span>Service categories</span>
                  <strong>8</strong>
                </div>
                <div className="customer-metric-card">
                  <span>Bookings this month</span>
                  <strong>100+</strong>
                </div>
              </div>
            </div>

            <div className="customer-hero-visual">
              <div className="visual-panel">
                <h3>Wedding planning pulse</h3>
                <p>
                  Everything you need to stay on schedule: upcoming bookings, saved vendors, and priority actions in one finished view.
                </p>

                <div className="visual-metrics">
                  <span className="visual-chip">Top vendor matches</span>
                  <span className="visual-chip">3 days until next booking</span>
                  <span className="visual-chip">Priority planning tips</span>
                  <span className="visual-chip">Custom budget tracker</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-grid customer-dashboard-grid">
            {quickActions.map((action) => (
              <div className="dashboard-card action-card" key={action.title}>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <Link to={action.to} className="btn btn-outline dashboard-card-action">
                  {action.button}
                </Link>
              </div>
            ))}
          </section>

          <section className="dashboard-panel customer-insights-panel">
            <div className="insight-card">
              <h3>Your planning hub</h3>
              <p>
                A modern thinking space where bookings, vendor recommendations, and event milestones stay aligned and easy to review.
              </p>
            </div>
            <div className="insight-card insight-highlight">
              <h3>Ready to book</h3>
              <p>
                Lock in your preferred vendors now to make sure the best wedding dates stay open.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
