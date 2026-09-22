import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCustomerProfile, updateCustomerProfile } from "../../api/customerApi";
import { getProfileErrorMessage } from "../../api/errorHandler";
import Loader from "../common/Loader";
import "../../styles/Dashboard.css";
import CustomerPageLayout from "./CustomerPageLayout";

// Default profile structure
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

// Normalize API response to form state
const normalizeProfile = (profileData) => ({
  fullName: profileData?.fullName || "",
  email: profileData?.email || "",
  phone: profileData?.phone || "",
  city: profileData?.city || "",
  weddingDate: profileData?.weddingDate || "",
  budget:
    profileData?.budget !== null && profileData?.budget !== undefined
      ? String(profileData.budget)
      : "",
  weddingType: profileData?.weddingType || "",
  notes: profileData?.notes || "",
});

// Validation utilities
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9\s\-+()]{10,}$/.test(phone);

const CustomerProfile = () => {
  const { displayName, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(defaultProfile);
  const [originalProfile, setOriginalProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced"); // synced, syncing, pending

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getCustomerProfile();
        
        // Handle empty or null response
        if (!response || !response.data) {
          setProfile(defaultProfile);
          setOriginalProfile(defaultProfile);
          setError("");
        } else {
          const normalizedData = normalizeProfile(response.data);
          setProfile(normalizedData);
          setOriginalProfile(normalizedData);
          setError("");
        }
        
        setLastSaved(new Date());
        setSyncStatus("synced");
      } catch (err) {
        console.error("Failed to load customer profile:", err);
        const errorMessage = getProfileErrorMessage(err);
        setError(errorMessage);
        setSyncStatus("error");
        
        // For 404, initialize with empty profile
        if (err.response?.status === 404) {
          setProfile(defaultProfile);
          setOriginalProfile(defaultProfile);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Check for changes in profile
  useEffect(() => {
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(profileChanged);
  }, [profile, originalProfile]);

  // Auto-save functionality with debounce
  useEffect(() => {
    if (!hasChanges || Object.keys(touched).length === 0) return;

    const autoSaveTimeout = setTimeout(async () => {
      try {
        setAutoSaving(true);
        setSyncStatus("syncing");

        const payload = {
          ...profile,
          budget: profile.budget ? Number(profile.budget) : null,
        };

        const response = await updateCustomerProfile(payload);
        
        if (!response || !response.data) {
          setSyncStatus("pending");
          setAutoSaving(false);
          return;
        }
        
        const updatedProfile = normalizeProfile(response.data);
        setOriginalProfile(updatedProfile);
        setLastSaved(new Date());
        setSyncStatus("synced");
        setAutoSaving(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          if (success === "Profile auto-saved successfully.") {
            setSuccess("");
          }
        }, 3000);
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSyncStatus("pending");
        setAutoSaving(false);
      }
    }, 2000); // 2-second debounce

    return () => clearTimeout(autoSaveTimeout);
  }, [profile, touched, hasChanges]);

  // Validate individual field
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Full name must be at least 2 characters";
        } else {
          delete newErrors.fullName;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!validatePhone(value)) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;

      case "weddingDate":
        if (value && new Date(value) < new Date()) {
          newErrors.weddingDate = "Wedding date cannot be in the past";
        } else {
          delete newErrors.weddingDate;
        }
        break;

      case "budget":
        if (value && Number(value) < 0) {
          newErrors.budget = "Budget cannot be negative";
        } else {
          delete newErrors.budget;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }, [errors]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    // Mark field as touched for auto-save
    setTouched((current) => ({
      ...current,
      [name]: true,
    }));

    // Set sync status
    setSyncStatus("pending");

    // Clear success/error messages on change
    if (success) setSuccess("");
    if (error) setError("");

    // Validate if field was touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((current) => ({
      ...current,
      [name]: true,
    }));
    validateField(name, value);
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diffMs = now - lastSaved;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return lastSaved.toLocaleDateString();
  };

  // Save profile with manual save button
  const handleSave = async () => {
    // Validate all required fields
    const fieldsToValidate = ["fullName", "email", "phone"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      if (!validateField(field, profile[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError("Please fix the errors before saving.");
      return;
    }

    try {
      setSaving(true);
      setSyncStatus("syncing");
      setError("");
      setSuccess("");

      const payload = {
        ...profile,
        budget: profile.budget ? Number(profile.budget) : null,
      };

      const response = await updateCustomerProfile(payload);
      
      if (!response || !response.data) {
        setError("Failed to save profile: No response from server");
        setSyncStatus("error");
        return;
      }
      
      const updatedProfile = normalizeProfile(response.data);
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setTouched({});
      setErrors({});
      setLastSaved(new Date());
      setSyncStatus("synced");
      setSuccess("Your profile has been saved successfully.");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      console.error("Failed to save customer profile:", err);
      setSyncStatus("error");
      
      let errorMessage = "Unable to save your profile. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to update this profile.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid profile data. Please check your input.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CustomerPageLayout title="Your Profile" className="customer-profile-page">
        <Loader />
      </CustomerPageLayout>
    );
  }

  return (
    <CustomerPageLayout
      title="Your Profile"
      className="customer-profile-page"
    >
      {/* Sync Status Bar */}
      <div className="profile-sync-status-bar">
        <div className="sync-status-content">
          <div className="sync-indicator">
            <span className={`sync-dot sync-${syncStatus}`}></span>
            <div className="sync-info">
              {syncStatus === "synced" && (
                <span className="sync-text">
                  ✓ All changes saved
                  {lastSaved && <span className="sync-time">{formatLastSaved()}</span>}
                </span>
              )}
              {syncStatus === "syncing" && (
                <span className="sync-text">⟳ Saving changes...</span>
              )}
              {syncStatus === "pending" && (
                <span className="sync-text">● Pending changes</span>
              )}
              {syncStatus === "error" && (
                <span className="sync-text">✕ Sync error</span>
              )}
            </div>
          </div>
          {displayName && <span className="profile-user-name">👤 {displayName}</span>}
        </div>
      </div>

      {/* Hero Section */}
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
            <span className="summary-value">
              {profile.budget ? `₹${Number(profile.budget).toLocaleString("en-IN")}` : "—"}
            </span>
            <p>Estimated budget</p>
          </div>
        </div>
      </section>

      {/* Status Messages */}
      {error && (
        <div className="service-list-error">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="service-list-success">
          <p>{success}</p>
        </div>
      )}

      {/* Profile Content */}
      <section className="customer-profile-grid">
        {/* Profile Summary Card - Real-time Preview */}
        <div className="profile-card profile-summary-card">
          <div className="profile-summary-header">
            <h2>Wedding Profile Preview</h2>
            {hasChanges && (
              <span className="changes-indicator">
                {autoSaving ? "⟳ Auto-saving..." : "● Unsaved changes"}
              </span>
            )}
          </div>
          <p>
            Share this profile with your favorite vendors and keep your details updated as plans change.
          </p>

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
            <span>Wedding Date</span>
            <strong>{profile.weddingDate || "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Budget</span>
            <strong>{profile.budget ? `₹${Number(profile.budget).toLocaleString("en-IN")}` : "Not set"}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Wedding Type</span>
            <strong>{profile.weddingType || "Not set"}</strong>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="profile-card">
          <div className="form-header">
            <h2>Edit Profile</h2>
            <div className="form-meta">
              {hasChanges && (
                <span className="form-changes-badge">
                  {autoSaving ? "⟳ Saving..." : "● Changes detected"}
                </span>
              )}
            </div>
          </div>
          <p className="form-description">
            Fields marked with <span className="required-indicator">*</span> are required. Changes auto-save after 2 seconds.
          </p>

          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">
                Full Name <span className="required-indicator">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={profile.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.fullName && errors.fullName ? "input-error" : ""}
              />
              {touched.fullName && errors.fullName && (
                <span className="field-error">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required-indicator">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={profile.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? "input-error" : ""}
              />
              {touched.email && errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required-indicator">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profile.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? "input-error" : ""}
              />
              {touched.phone && errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter your city"
                value={profile.city}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* Wedding Date */}
            <div className="form-group">
              <label htmlFor="weddingDate">Wedding Date</label>
              <input
                id="weddingDate"
                name="weddingDate"
                type="date"
                value={profile.weddingDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.weddingDate && errors.weddingDate ? "input-error" : ""}
              />
              {touched.weddingDate && errors.weddingDate && (
                <span className="field-error">{errors.weddingDate}</span>
              )}
            </div>

            {/* Budget */}
            <div className="form-group">
              <label htmlFor="budget">Budget (INR)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                placeholder="Enter your budget"
                value={profile.budget}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.budget && errors.budget ? "input-error" : ""}
                min="0"
              />
              {touched.budget && errors.budget && (
                <span className="field-error">{errors.budget}</span>
              )}
            </div>

            {/* Wedding Type */}
            <div className="form-group">
              <label htmlFor="weddingType">Wedding Type</label>
              <select
                id="weddingType"
                name="weddingType"
                value={profile.weddingType}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select wedding type</option>
                <option value="Traditional">Traditional</option>
                <option value="Destination">Destination</option>
                <option value="Beach">Beach</option>
                <option value="Luxury">Luxury</option>
                <option value="Intimate">Intimate</option>
              </select>
            </div>

            {/* Notes */}
            <div className="form-group full-width">
              <label htmlFor="notes">Planning Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="5"
                placeholder="Add any additional notes about your wedding plans..."
                value={profile.notes}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || !Object.keys(touched).length}
                title={!Object.keys(touched).length ? "Make changes to enable save" : "Save profile immediately"}
              >
                {saving ? "Saving..." : hasChanges ? "Save Now" : "Save Profile"}
              </button>
              {lastSaved && (
                <span className="save-info">
                  Last saved: {formatLastSaved()}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>
    </CustomerPageLayout>
  );
};

export default CustomerProfile;
