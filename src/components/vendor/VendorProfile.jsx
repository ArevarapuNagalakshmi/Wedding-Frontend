import React, { useEffect, useState } from "react";
import { getVendorProfile, updateVendorProfile, createVendorProfile, uploadPortfolioFiles } from "../../api/vendorApi";
import { getBlockedDates } from "../../api/availabilityApi";
import Loader from "../common/Loader";
import "../../styles/Dashboard.css";
import VendorHeader from "./VendorHeader";
import VendorLayout from "./VendorLayout";

const defaultVendor = {
  businessName: "",
  category: "",
  description: "",
  city: "",
  address: "",
  pricingRange: "",
  responseTime: "",
  gstin: "",
  latitude: null,
  longitude: null,
  categoryTags: [],
  imageUrls: [],
  videoUrls: [],
};

const SimpleCalendar = ({ value, onChange, blockedDates }) => {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(value);
  const firstDay = getFirstDayOfMonth(value);
  const days = [];

  for (let i = 0; i < firstDay; i += 1) days.push(null);
  for (let i = 1; i <= daysInMonth; i += 1) days.push(i);

  const isBlocked = (day) => blockedDates.some((d) => d.getDate() === day && d.getMonth() === value.getMonth() && d.getFullYear() === value.getFullYear());

  return (
    <div className="panel-box">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() - 1))} className="btn btn-outline">
          ←
        </button>
        <h3 style={{ margin: 0 }}>{value.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
        <button type="button" onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() + 1))} className="btn btn-outline">
          →
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: 700, fontSize: "12px", color: "#0f4a5a", padding: "6px" }}>{d}</div>
        ))}
        {days.map((day, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => day && onChange(new Date(value.getFullYear(), value.getMonth(), day))}
            style={{
              padding: "10px",
              borderRadius: "12px",
              background: day ? (isBlocked(day) ? "#1da3b0" : "#f8fbfc") : "transparent",
              color: day ? (isBlocked(day) ? "white" : "#0f4a5a") : "transparent",
              border: day ? "1px solid #dce8ee" : "none",
              cursor: day ? "pointer" : "default",
              minHeight: "34px",
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

const VendorProfile = () => {
  const [vendor, setVendor] = useState(defaultVendor);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryTagsText, setCategoryTagsText] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getVendorProfile();
        const profile = res.data;
        setVendor(profile);
        setProfileExists(true);
        setCategoryTagsText((profile.categoryTags || []).join(", "));

        if (profile.id) {
          const availRes = await getBlockedDates(profile.id);
          setBlockedDates(
            availRes.data.map((item) => new Date(item.blockedDate))
          );
        }
      } catch (err) {
        console.error("Unable to load vendor profile", err);
        setError("Unable to load profile. If you haven't created one yet, fill out the form and click Save Profile.");
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...vendor,
        categoryTags: categoryTagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      const res = profileExists && vendor.id
        ? await updateVendorProfile(payload)
        : await createVendorProfile(payload);

      setVendor(res.data);
      setProfileExists(true);
      setCategoryTagsText((res.data.categoryTags || []).join(", "));
      setSuccess("Profile saved successfully.");
      setError("");
    } catch (err) {
      console.error("Failed to save profile", err);
      setError("Unable to save profile. Please try again.");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  // Handle local image selection and previews
  const handleImageSelect = (files) => {
    const list = Array.from(files || []);
    setImageFiles(list);
    const previews = list.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    const removed = newPreviews.splice(index, 1);
    // revoke object URL
    removed.forEach((u) => URL.revokeObjectURL(u));
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const uploadFiles = async (type, files) => {
    if (!files.length) {
      return;
    }

    try {
      if (type === "images") {
        setUploadingImages(true);
      } else {
        setUploadingVideos(true);
      }
      setError("");
      const formData = new FormData();
      formData.append("type", type);
      files.forEach((file) => formData.append("files", file));

      const res = await uploadPortfolioFiles(formData);
      const urls = res.data || [];
      const updatedVendor = {
        ...vendor,
        [type === "images" ? "imageUrls" : "videoUrls"]: [
          ...(vendor?.[type === "images" ? "imageUrls" : "videoUrls"] || []),
          ...urls,
        ],
      };

      const saveResponse = await updateVendorProfile({
        ...updatedVendor,
        categoryTags: categoryTagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      const savedVendor = saveResponse.data;
      setVendor(savedVendor);
      setCategoryTagsText((savedVendor.categoryTags || []).join(", "));
      setSuccess(type === "images" ? "Images uploaded successfully." : "Videos uploaded successfully.");
      setError("");
      if (type === "images") {
        setImageFiles([]);
      } else {
        setVideoFiles([]);
      }
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
      setSuccess("");
    } finally {
      setUploadingImages(false);
      setUploadingVideos(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <VendorLayout vendor={vendor}>
      <VendorHeader businessInitials={(vendor && vendor.businessName && vendor.businessName.slice(0,2).toUpperCase()) || "VD"} />
      <section className="vendor-main-card">
        <div className="vendor-main-card-inner">
          <div className="main-card-left">
            <div className="badge">Vendor Profile</div>
            <h2>{vendor?.businessName || "Your Vendor Profile"}</h2>
            <p>Publish portfolio images, category tags, pricing range, and availability for couples to trust your service.</p>
          </div>
          <aside className="main-card-right">
            <div className="meta-box">
              <span>Status</span>
              <strong>{vendor?.verified === false ? "Pending Approval" : "Approved"}</strong>
            </div>
            <div className="meta-box">
              <span>Rating</span>
              <strong>{vendor?.rating?.toFixed?.(1) || "N/A"}</strong>
            </div>
            <div className="meta-box">
              <span>Response Time</span>
              <strong>{vendor?.responseTime || "Not set"}</strong>
            </div>
            <div className="meta-box">
              <span>Location</span>
              <strong>{vendor?.city || vendor?.address || "Not set"}</strong>
            </div>
          </aside>
        </div>
      </section>

      {error && <div className="vendor-dashboard-alert">{error}</div>}
      {success && <div className="vendor-dashboard-success">{success}</div>}

      <section className="vendor-profile-preview">
        <div className="preview-row">
          <div>
            <div className="preview-label">Category</div>
            <div className="preview-value">{vendor?.category || "Not specified"}</div>
          </div>
          <div>
            <div className="preview-label">Pricing</div>
            <div className="preview-value">{vendor?.pricingRange || "Not set"}</div>
          </div>
          <div>
            <div className="preview-label">City</div>
            <div className="preview-value">{vendor?.city || "-"}</div>
          </div>
        </div>

        {(vendor?.categoryTags || []).length > 0 && (
          <div className="tag-list" style={{ marginTop: 12 }}>
            {(vendor.categoryTags || []).map((t) => (
              <span key={t} className="tag-badge">{t}</span>
            ))}
          </div>
        )}

        {vendor?.imageUrls?.length > 0 && (
          <div className="image-gallery" style={{ marginTop: 18 }}>
            {vendor.imageUrls.slice(0, 6).map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="gallery-item">
                <img src={url} alt="portfolio" />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="vendor-form-panel">
        <div className="vendor-form">
          <div className="vendor-form-group">
            <label className="vendor-form-label">Business Name</label>
            <input
              name="businessName"
              className="vendor-form-input"
              value={vendor?.businessName || ""}
              onChange={handleChange}
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Category</label>
            <input
              name="category"
              className="vendor-form-input"
              value={vendor?.category || ""}
              onChange={handleChange}
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Category Tags</label>
            <input
              className="vendor-form-input"
              value={categoryTagsText}
              onChange={(e) => setCategoryTagsText(e.target.value)}
              placeholder="e.g. photography, decoration, catering"
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Description</label>
            <textarea
              name="description"
              className="vendor-form-textarea"
              value={vendor?.description || ""}
              onChange={handleChange}
              placeholder="Tell couples about your experience and specialties"
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Address</label>
            <input
              name="address"
              className="vendor-form-input"
              value={vendor?.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">City</label>
            <input
              name="city"
              className="vendor-form-input"
              value={vendor?.city || ""}
              onChange={handleChange}
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Response Time</label>
            <input
              name="responseTime"
              className="vendor-form-input"
              value={vendor?.responseTime || ""}
              onChange={handleChange}
              placeholder="e.g. 24 hours"
            />
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">GSTIN</label>
            <input
              name="gstin"
              className="vendor-form-input"
              value={vendor?.gstin || ""}
              onChange={handleChange}
            />
          </div>


          <div className="vendor-form-group">
            <label className="vendor-form-label">Upload Portfolio Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="vendor-form-input"
              onChange={(e) => handleImageSelect(e.target.files)}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              {imagePreviews.map((src, idx) => (
                <div key={src} style={{ position: "relative" }}>
                  <img src={src} alt={`preview-${idx}`} style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 8, border: "1px solid #e6eef2" }} />
                  <button type="button" onClick={() => removeImagePreview(idx)} style={{ position: "absolute", right: 2, top: 2, background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}>x</button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!imageFiles.length || uploadingImages}
              onClick={() => uploadFiles("images", imageFiles)}
            >
              {uploadingImages ? "Uploading images..." : "Upload Images"}
            </button>
            {vendor?.imageUrls?.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <strong>Saved image URLs:</strong>
                <div className="image-gallery" style={{ marginTop: 8 }}>
                  {vendor.imageUrls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="gallery-item">
                      <img src={url} alt="portfolio" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Upload Portfolio Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              className="vendor-form-input"
              onChange={(e) => setVideoFiles(Array.from(e.target.files || []))}
            />
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!videoFiles.length || uploadingVideos}
              onClick={() => uploadFiles("videos", videoFiles)}
            >
              {uploadingVideos ? "Uploading videos..." : "Upload Videos"}
            </button>
            {videoFiles.length > 0 && (
              <p style={{ marginTop: "8px", color: "#4b4b4b" }}>
                {videoFiles.length} video file(s) selected.
              </p>
            )}
            {vendor?.videoUrls?.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <strong>Saved video URLs:</strong>
                <ul style={{ margin: "8px 0 0 18px", color: "#0f4a5a" }}>
                  {vendor.videoUrls.map((url) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="vendor-form-group">
            <label className="vendor-form-label">Pricing Range</label>
            <select
              name="pricingRange"
              className="vendor-form-input"
              value={vendor?.pricingRange || ""}
              onChange={handleChange}
            >
              <option value="">Select pricing pack</option>
              <option value="1">1 - Basic Pack</option>
              <option value="2">2 - Gold</option>
              <option value="3">3 - Diamond</option>
              <option value="4">4 - Customise Yourself</option>
            </select>
          </div>

          <div className="vendor-form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </section>

      <section className="calendar-section" style={{ marginTop: "28px" }}>
        <h2>Availability Calendar</h2>
        <p style={{ marginBottom: "16px" }}>
          Blocked dates are highlighted in teal. Keep your availability up to date for customers.
        </p>
        <SimpleCalendar value={selectedDate} onChange={setSelectedDate} blockedDates={blockedDates} />
        {blockedDates.length === 0 ? (
          <p style={{ marginTop: "12px", color: "#5f7585" }}>
            No blocked dates have been set yet.
          </p>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <strong>Blocked dates:</strong>
            <ul style={{ margin: "10px 0 0 18px", color: "#0f4a5a" }}>
              {blockedDates.map((date) => (
                <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      </VendorLayout>
  );
};

export default VendorProfile;
