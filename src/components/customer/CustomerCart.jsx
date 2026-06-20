import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";

const CustomerCart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="dashboard-container customer-cart-page">
      <CustomerHeader title="Your Bag" />
      <section className="customer-hero-panel">
        <div className="customer-hero-copy">
          <span className="dashboard-badge">Your Bag</span>
          <h1>Review your selected packages before checkout.</h1>
          <p>
            Add the services you want to book, then continue to billing to confirm your wedding package.
          </p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <div className="service-list-error">
          <h3>Your bag is empty</h3>
          <p>Browse services and add a package to your bag to begin checkout.</p>
          <Link className="btn btn-primary" to="/customer/services">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="customer-cart-list">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>
                    <strong>Vendor:</strong> {item.vendorName || item.vendorId}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                </div>
                <button className="btn btn-outline" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="cart-summary-card">
            <h3>Order summary</h3>
            <p>{cartItems.length} package(s) in your bag</p>
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/customer/billing")}>Proceed to Billing</button>
            <button className="btn btn-outline" onClick={clearCart}>
              Clear Bag
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
