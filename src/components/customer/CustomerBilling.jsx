import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../../api/bookingApi";
import { getServiceById } from "../../api/serviceApi";
import { CartContext } from "../../context/CartContext";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";

const CustomerBilling = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);

  const [service, setService] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!serviceId) return;

    const loadService = async () => {
      try {
        const response = await getServiceById(serviceId);
        setService(response.data);
      } catch (err) {
        console.error("Unable to load billing item", err);
        setError("Unable to load selected package. Please try again.");
      }
    };

    loadService();
  }, [serviceId]);

  const itemsToBook = serviceId
    ? service
      ? [service]
      : []
    : cartItems;

  const total = itemsToBook.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!eventDate) {
      setError("Please choose an event date before continuing.");
      return;
    }

    if (itemsToBook.length === 0) {
      setError("No services selected for billing.");
      return;
    }

    setSubmitting(true);

    try {
      await Promise.all(
        itemsToBook.map((item) =>
          bookService({
            serviceId: item.id,
            eventDate,
            notes,
          })
        )
      );

      if (!serviceId) {
        clearCart();
      }

      navigate("/customer/bookings");
    } catch (err) {
      console.error("Booking failed", err);
      setError("Unable to complete checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container customer-billing-page">
      <CustomerHeader title="Billing" />
      <section className="customer-hero-panel">
        <div className="customer-hero-copy">
          <span className="dashboard-badge">Billing</span>
          <h1>{serviceId ? "Confirm your booking" : "Checkout your bag"}</h1>
          <p>
            Review the selected packages, choose your event date, and complete the booking process.
          </p>
        </div>
      </section>

      {error && (
        <div className="service-list-error">
          <p>{error}</p>
        </div>
      )}

      <div className="billing-page-grid">
        <div className="billing-form-card">
          <h3>Billing details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="eventDate">Event Date</label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="notes">Booking notes</label>
              <textarea
                id="notes"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special requests or venue notes"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {serviceId ? "Pay and Book" : "Complete Checkout"}
            </button>
          </form>
        </div>

        <aside className="billing-summary-card">
          <h3>Order summary</h3>
          {itemsToBook.length === 0 ? (
            <p>No packages selected.</p>
          ) : (
            itemsToBook.map((item) => (
              <div className="billing-summary-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))
          )}
          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerBilling;
