import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../api/bookingApi";
import Loader from "../common/Loader";
import "../../styles/Dashboard.css";
import "../../styles/MyBookings.css";
import CustomerPageLayout from "./CustomerPageLayout";

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

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.eventDate) return false;
    const eventDate = new Date(booking.eventDate);
    return eventDate >= new Date();
  }).length;
  const confirmedCount = bookings.filter((booking) => booking.status?.toLowerCase() === "confirmed").length;

  return (
    <CustomerPageLayout
      title="My Bookings"
      className="customer-dashboard-page"
    >
      <section className="booking-page-main">
        <div className="booking-summary">
          <div className="booking-header-panel">
            <div>
              <span className="dashboard-badge">My Bookings</span>
              <h2>Your confirmed services and upcoming events</h2>
              <p>Track vendor reservations, event dates, and booking status from one central page.</p>
            </div>
            <div className="booking-empty-actions">
              <Link to="/customer" className="btn btn-outline">
                Back to home
              </Link>
              <Link to="/customer/services" className="btn btn-primary">
                Browse services
              </Link>
            </div>
          </div>

          <div className="booking-summary-cards">
            <div className="booking-summary-card">
              <h3>{totalBookings}</h3>
              <p>Total bookings</p>
            </div>
            <div className="booking-summary-card">
              <h3>{upcomingBookings}</h3>
              <p>Upcoming events</p>
            </div>
            <div className="booking-summary-card">
              <h3>{confirmedCount}</h3>
              <p>Confirmed services</p>
            </div>
          </div>
        </div>

        <section className="bookings-section">
          <div className="booking-header-panel">
            <div>
              <h2>Recent bookings</h2>
              <p>Review each reservation, vendor details, and payment summary in a clean layout.</p>
            </div>
          </div>

          {error && <div className="vendor-page-alert">{error}</div>}

          {bookings.length === 0 ? (
            <div className="booking-empty-state">
              <h3>No bookings found</h3>
              <p>Your booked events will appear here as soon as you confirm a service.</p>
              <div className="booking-empty-actions">
                <Link to="/customer/services" className="btn btn-primary">
                  Browse Services
                </Link>
                <Link to="/customer/profile" className="btn btn-outline">
                  Update profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="dashboard-grid customer-dashboard-grid">
              {bookings.map((booking) => {
                const bookingDate = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-IN") : "Not set";
                const statusKey = booking.status?.toLowerCase() || "unknown";

                return (
                  <div className="dashboard-card booking-card" key={booking.id || booking._id}>
                    <div className="booking-card-header">
                      <h3>{booking.serviceName || "Booked Service"}</h3>
                      <span className={`status-${statusKey}`}>
                        {booking.status || "Unknown"}
                      </span>
                    </div>

                    <div className="booking-meta">
                      <p><strong>Event date:</strong> {bookingDate}</p>
                      <p><strong>Vendor:</strong> {booking.vendorName || booking.vendor?.businessName || "Unknown vendor"}</p>
                      <p><strong>Location:</strong> {booking.location?.address || booking.location || "Not provided"}</p>
                      <p><strong>Total price:</strong> ₹{Number(booking.totalPrice || 0).toLocaleString()}</p>
                    </div>

                    <p>{booking.notes || booking.description || "No additional details."}</p>

                    <div className="dashboard-card-actions">
                      <Link to="/customer/services" className="btn btn-outline">
                        View available services
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </CustomerPageLayout>
  );
};

export default MyBookings;
