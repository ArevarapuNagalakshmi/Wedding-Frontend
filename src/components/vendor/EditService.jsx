import React, { useEffect, useState } from "react";
import { getServiceById, updateService } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";
import VendorLayout from "./VendorLayout";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, serviceRes] = await Promise.all([
          getVendorProfile(),
          getServiceById(id),
        ]);
        setVendor(profileRes.data);
        setService({
          name: serviceRes.data.name || "",
          description: serviceRes.data.description || "",
          price: serviceRes.data.price || "",
        });
      } catch (err) {
        console.error("Error loading service", err);
        setError("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const priceValue = Number(service.price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid service price.");
      setSubmitting(false);
      return;
    }

    try {
      await updateService(id, {
        ...service,
        price: priceValue,
      });
      navigate("/vendor/services");
    } catch (err) {
      console.error("Error updating service", err);
      if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            "Your vendor account is not authorized to update services yet. Please wait for admin approval."
        );
      } else {
        setError(
          err?.response?.data?.message || err?.message || "Unable to update service. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const vendorApproved = vendor?.approved !== false;

  if (loading) return <Loader />;

  if (!vendorApproved) {
    return (
      <VendorLayout vendor={vendor}>
        <div className="vendor-page-section vendor-pending-panel">
          <div className="vendor-page-header">
            <div>
              <h2>Vendor Approval Required</h2>
              <p>
                Your account must be approved by admin before you can update
                wedding services.
              </p>
            </div>
          </div>
          <div className="vendor-page-alert">
            Please wait for admin approval or contact support if you think this
            is an error.
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout vendor={vendor}>
        <div className="vendor-page-section vendor-form-panel">
          <div className="vendor-page-header">
        <div>
          <h2>Edit Service</h2>
          <p>Update your wedding service details and pricing to keep your profile current.</p>
        </div>
      </div>

      {error && <div className="vendor-page-alert">{error}</div>}

      <form className="vendor-form vendor-form-grid" onSubmit={handleSubmit}>
        <div className="vendor-form-group">
          <label className="vendor-form-label">Service Name</label>
          <input
            className="vendor-form-input"
            name="name"
            value={service.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="vendor-form-group">
          <label className="vendor-form-label">Description</label>
          <textarea
            className="vendor-form-textarea"
            name="description"
            value={service.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="vendor-form-group">
          <label className="vendor-form-label">Price</label>
          <input
            type="number"
            className="vendor-form-input"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="vendor-form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Service"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/vendor/services")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </VendorLayout>
  );
};

export default EditService;
