import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../../api/serviceApi";
import { CartContext } from "../../context/CartContext";
import "../../styles/Dashboard.css";
import CustomerPageLayout from "./CustomerPageLayout";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isServiceInCart, toggleSaveVendor, isVendorSaved } = useContext(CartContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getServiceById(serviceId);
        setService(response.data);
      } catch (err) {
        console.error("Unable to load service details", err);
        setError("Unable to load service details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleAddToBag = () => {
    addToCart(service);
  };

  const handleSaveVendor = () => {
    const vendorId = service.vendorId || service.vendor?.id;
    if (!vendorId) return;

    toggleSaveVendor({
      vendorId,
      vendorName: service.vendor?.name || service.vendorName || `Vendor ${vendorId}`,
    });
  };

  const bookNow = () => {
    navigate(`/customer/billing/${service.id}`);
  };

  if (loading) {
    return <div className="service-detail-page">Loading service details...</div>;
  }

  if (error) {
    return (
      <div className="service-list-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!service) {
    return <div className="service-detail-page">Service not found.</div>;
  }

  const vendorId = service.vendorId || service.vendor?.id;
  const saved = vendorId ? isVendorSaved(vendorId) : false;
  const inBag = isServiceInCart(service.id);

  return (
    <CustomerPageLayout
      title={service ? service.name : "Service Details"}
      className="service-detail-page"
    >
      <div className="service-detail-card">
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <div className="service-detail-meta">
          <span>{service.category || "Wedding Service"}</span>
          <span>{service.city || "Anywhere"}</span>
          <span>Price: ₹{service.price}</span>
        </div>
        <div className="service-detail-actions">
          <button className="btn btn-primary" onClick={bookNow}>
            Book Now
          </button>
          {vendorId && (
            <button className="btn btn-outline" onClick={() => navigate(`/vendor/${vendorId}`)}>
              View Vendor Profile
            </button>
          )}
          <button className="btn btn-outline" onClick={handleAddToBag} disabled={inBag}>
            {inBag ? "Added to Bag" : "Add to Bag"}
          </button>
          {vendorId && (
            <button
              className={saved ? "btn btn-primary" : "btn btn-outline"}
              onClick={handleSaveVendor}
            >
              {saved ? "Vendor Saved" : "Save Vendor"}
            </button>
          )}
        </div>
        <div className="service-detail-summary">
          <h3>Package details</h3>
          <p>
            {service.description || "This package includes venue coordination, vendor communication, and a dedicated planning specialist."}
          </p>
          <div className="service-detail-summary-row">
            <strong>Vendor ID</strong>
            <span>{vendorId || "Unknown"}</span>
          </div>
          <div className="service-detail-summary-row">
            <strong>Estimated price</strong>
            <span>₹{service.price}</span>
          </div>
          <div className="service-detail-summary-row">
            <strong>Category</strong>
            <span>{service.category || "General"}</span>
          </div>
        </div>
      </div>
    </CustomerPageLayout>
  );
};

export default ServiceDetails;
