import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../api/bookingApi";
import Loader from "../common/Loader";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getMyBookings();
        setBookings(response.data || []);
        setError("");
      } catch (err) {
        console.error("Unable to load bookings", err);
        setError("Unable to load your bookings right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container customer-dashboard-page">
      <CustomerHeader title="My Bookings" />
      <section className="customer-hero-panel">
        <div className="customer-hero-copy">
          <span className="dashboard-badge">My Bookings</span>
          <h1>Your booked vendor services</h1>
          <p>View confirmed reservations, event dates, and booking status in one place.</p>
          <div className="customer-hero-actions">
            <Link to="/customer" className="btn btn-outline">
              Back to dashboard
            </Link>
            <Link to="/customer/services" className="btn btn-primary">
              Browse services
            </Link>
          </div>
        </div>
      </section>

      {error && <div className="vendor-page-alert">{error}</div>}

      {bookings.length === 0 ? (
        <div className="service-empty-state">
          <h3>No bookings found</h3>
          <p>Once you book a service, your upcoming events will show up here.</p>
          <Link to="/customer/services" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <section className="dashboard-grid customer-dashboard-grid">
          {bookings.map((booking) => (
            <div className="dashboard-card booking-card" key={booking.id || booking._id}>
              <div className="booking-card-header">
                <h3>{booking.serviceName || "Booked Service"}</h3>
                <span className={`status-${booking.status?.toLowerCase() || "unknown"}`}>
                  {booking.status || "Unknown"}
                </span>
              </div>
              <p><strong>Event date:</strong> {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-IN") : "Not set"}</p>
              <p><strong>Vendor:</strong> {booking.vendorName || booking.vendor?.businessName || "Unknown vendor"}</p>
              <p><strong>Location:</strong> {booking.location?.address || booking.location || "Not provided"}</p>
              <p><strong>Total price:</strong> ₹{Number(booking.totalPrice || 0).toLocaleString()}</p>
              <p>{booking.notes || booking.description || "No additional details."}</p>
              <div className="dashboard-card-actions">
                <Link to="/customer/services" className="btn btn-outline">
                  View available services
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MyBookings;
