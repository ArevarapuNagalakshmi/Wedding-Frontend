import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomerProfile, updateCustomerProfile } from "../../api/customerApi";
import "../../styles/Dashboard.css";
import CustomerHeader from "./CustomerHeader";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  weddingDate: "",
  budget: "",
  weddingType: "",
  notes: "",
};

const normalizeProfile = (profileData) => ({
  fullName: profileData.fullName || "",
  email: profileData.email || "",
  phone: profileData.phone || "",
  city: profileData.city || "",
  weddingDate: profileData.weddingDate || "",
  budget:
    profileData.budget !== null && profileData.budget !== undefined
      ? String(profileData.budget)
      : "",
  weddingType: profileData.weddingType || "",
  notes: profileData.notes || "",
});

const CustomerProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getCustomerProfile();
        setProfile(normalizeProfile(response.data));
      } catch (err) {
        console.error("Failed to load customer profile", err);
        setError("Unable to load profile data. Please try again.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    if (!profile.fullName || !profile.email || !profile.phone) {
      setError("Please fill in your name, email, and phone before saving.");
      setSuccess("");
      return;
    }

    try {
      const payload = {
        ...profile,
        budget: profile.budget ? Number(profile.budget) : null,
      };
      const response = await updateCustomerProfile(payload);
      setProfile(normalizeProfile(response.data));
      setSuccess("Customer profile saved successfully.");
      setError("");
    } catch (err) {
      console.error("Failed to save customer profile", err);
      setError("Unable to save the profile. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="dashboard-container customer-profile-page">
      <CustomerHeader title="Your Profile" />
      <section className="customer-hero-panel">
        <div className="customer-hero-copy">
          <span className="dashboard-badge">Customer Profile</span>
          <h1>Keep your wedding planning details in one place.</h1>
          <p>
            Save your contact details, wedding date, budget, and venue preferences so vendors can get the right quote quickly.
          </p>
          <div className="customer-hero-actions">
            <Link to="/customer/services" className="btn btn-outline">
              Browse Vendors
            </Link>
            <Link to="/customer/bookings" className="btn btn-primary">
              View Bookings
            </Link>
          </div>
        </div>

        <div className="customer-hero-summary">
          <div className="summary-card">
            <span className="summary-value">{profile.weddingDate || "—"}</span>
            <p>Wedding date</p>
          </div>
          <div className="summary-card">
            <span className="summary-value">{profile.city || "—"}</span>
            <p>Planned location</p>
          </div>
          <div className="summary-card">
            <span className="summary-value">{profile.budget ? `₹${profile.budget}` : "—"}</span>
            <p>Estimated budget</p>
          </div>
        </div>
      </section>

      {error && <div className="service-list-error"><p>{error}</p></div>}
      {success && <div className="service-list-success"><p>{success}</p></div>}

      <section className="customer-profile-grid">
        <div className="profile-card profile-summary-card">
          <h2>Wedding profile</h2>
          <p>Share this profile with your favorite vendors and keep your details updated as plans change.</p>

          <div className="profile-detail-row">
            <span>Name</span>
            <strong>{profile.fullName || "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Email</span>
            <strong>{profile.email || "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Phone</span>
            <strong>{profile.phone || "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>City</span>
            <strong>{profile.city || "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Wedding type</span>
            <strong>{profile.weddingType || "Not set"}</strong>
          </div>
        </div>

        <div className="profile-card">
          <h2>Edit profile</h2>
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={profile.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weddingDate">Wedding Date</label>
              <input
                id="weddingDate"
                name="weddingDate"
                type="date"
                value={profile.weddingDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget (INR)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                value={profile.budget}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weddingType">Wedding Type</label>
              <select
                id="weddingType"
                name="weddingType"
                value={profile.weddingType}
                onChange={handleChange}
              >
                <option value="">Select wedding type</option>
                <option value="Traditional">Traditional</option>
                <option value="Destination">Destination</option>
                <option value="Beach">Beach</option>
                <option value="Luxury">Luxury</option>
                <option value="Intimate">Intimate</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Plan notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="5"
                value={profile.notes}
                onChange={handleChange}
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save Profile
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CustomerProfile;
