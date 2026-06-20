import React, { useEffect, useState } from "react";
import { addService } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../common/Loader";
import VendorLayout from "./VendorLayout";

const AddService = () => {
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const profileRes = await getVendorProfile();
        setVendor(profileRes.data);
      } catch (err) {
        console.error("Error loading vendor profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, []);

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
      await addService(vendor.id, {
        ...service,
        price: priceValue,
      });
      navigate("/vendor/services");
    } catch (err) {
      console.error("Error saving service", err);
      if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            "Your vendor account is not authorized to add services yet. Please wait for admin approval."
        );
      } else {
        setError(
          err?.response?.data?.message || err?.message || "Unable to save service. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const presets = [
    { name: "Photography", price: 25000, description: "Professional wedding photography packages." },
    { name: "Videography", price: 35000, description: "Cinematic video coverage and highlight reels." },
    { name: "Catering", price: 45000, description: "Full-service catering and menu customization." },
    { name: "Decoration", price: 30000, description: "Venue and stage decoration services." },
    { name: "Venue Booking", price: 75000, description: "Assistance with venue search and booking." },
    { name: "Makeup Artist", price: 18000, description: "Bridal makeup packages with trial." },
    { name: "DJ & Music", price: 22000, description: "Live DJ and music production services." },
    { name: "Flower Decoration", price: 16000, description: "Floral decor and arrangements." },
    { name: "Stage Decoration", price: 40000, description: "Stage design and lighting packages." },
    { name: "Mehendi Artist", price: 12000, description: "Bridal and guest mehendi services." },
  ];

  const handlePresetChange = (e) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (!val) return;
    const preset = presets.find((p) => p.name === val);
    if (preset) {
      setService((s) => ({
        ...s,
        name: preset.name,
        price: String(preset.price),
        description: preset.description || s.description,
      }));
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
                Your account must be approved by admin before you can add new
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
          <h2>Add New Wedding Service</h2>
          <p>
            Create a service listing that appears on your vendor profile for
            couples to browse and book.
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>

      {error && <div className="vendor-page-alert">{error}</div>}

      <form className="vendor-form vendor-form-grid" onSubmit={handleSubmit}>
        <div className="vendor-form-group">
          <label className="vendor-form-label">Choose a preset</label>
          <select className="vendor-form-input" value={selectedPreset} onChange={handlePresetChange}>
            <option value="">— Select a preset —</option>
            {presets.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="vendor-form-group">
          <label className="vendor-form-label">Service Name</label>
          <input
            className="vendor-form-input"
            name="name"
            placeholder="Ex: Floral Decor Package"
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
            placeholder="Describe what makes this service special"
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
            placeholder="Enter the price in INR"
            value={service.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="vendor-form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Service"}
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

export default AddService;
