import React, { useEffect, useState } from "react";
import { getMyServices, deleteService } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import VendorLayout from "./VendorLayout";
import VendorHeader from "./VendorHeader";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const profileRes = await getVendorProfile();
      const servicesRes = await getMyServices(profileRes.data.id);
      setVendor(profileRes.data);
      setServices(servicesRes.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching services", err);
      setError("Unable to load services at the moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      setDeleting(true);
      // Optimistically remove the service from UI to improve responsiveness
      setServices((prev) => prev.filter((s) => (s.id || s._id) !== serviceId));

      try {
        await deleteService(serviceId);
      } catch (err) {
        // If deletion failed, re-fetch to restore state and show error
        console.error("Error deleting service", err);
        await fetchServices();
        setError("Unable to delete the service. Please try again.");
        return;
      }
    } catch (err) {
      console.error("Error deleting service", err);
      setError("Unable to delete the service. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  const vendorApproved = vendor?.approved !== false;

  if (!vendorApproved) {
    return (
      <VendorLayout vendor={vendor}>
        <VendorHeader businessInitials={(vendor?.businessName || "VD").slice(0, 2).toUpperCase()} />
        <section className="vendor-page-section vendor-pending-panel">
          <div className="vendor-page-header">
            <div>
              <h2>Vendor Approval Required</h2>
              <p>
                Your account is currently pending admin approval. You will be able
                to manage services once your vendor account is approved.
              </p>
            </div>
          </div>
          <div className="vendor-page-alert">
            Please wait for the administrator to approve your vendor account.
          </div>
        </section>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout vendor={vendor}>
      <VendorHeader businessInitials={(vendor?.businessName || "VD").slice(0, 2).toUpperCase()} />
      <section className="vendor-page-section">
        <div className="vendor-page-header">
          <div>
            <h2>Manage Your Wedding Services</h2>
            <p>
              Keep your service offerings up to date so couples can book the best
              wedding experience from your profile.
            </p>
          </div>
          <Link to="/vendor/add-service" className="btn btn-primary">
            Add New Service
          </Link>
        </div>

        {error && <div className="vendor-page-alert">{error}</div>}

        {services.length === 0 ? (
          <div className="service-empty-state">
            <h3>No services added yet</h3>
            <p>
              Add your first wedding service now and start capturing more bookings.
            </p>
            <Link to="/vendor/add-service" className="btn btn-primary">
              Add Service
            </Link>
          </div>
        ) : (
          <div className="service-grid">
            {services.map((service) => {
              const serviceId = service.id || service._id;
              return (
                <div className="service-card" key={serviceId}>
                  {service.imageUrls && service.imageUrls.length > 0 && (
                    <div className="service-image">
                      <img src={service.imageUrls[0]} alt={service.name} />
                    </div>
                  )}
                  <div className="service-card-top">
                    <h3>{service.name}</h3>
                    <span className="service-price">₹{service.price}</span>
                  </div>
                  <p>{service.description || "No description provided."}</p>
                  <div className="service-card-actions">
                    <Link
                      to={`/vendor/edit-service/${serviceId}`}
                      className="btn btn-outline"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      disabled={deleting}
                      onClick={() => handleDelete(serviceId)}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
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

export default MyServices;
