import React, { useEffect, useState } from "react";
import {
  getAllVendors,
  approveVendor,
  rejectVendor
} from "../../api/adminApi";

import VendorList from "./VendorList";
import Loader from "../common/Loader";

import "../../styles/VendorApproval.css";

const VendorApproval = () => {

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vendors from backend
  const fetchVendors = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await getAllVendors();

      setVendors(response.data);

    } catch (err) {

      console.error(err);
      setError("Failed to load vendors.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Approve vendor
  const handleApprove = async (vendorId) => {

    try {

      await approveVendor(vendorId);

      fetchVendors();

    } catch {

      setError("Failed to approve vendor");

    }
  };

  // Reject vendor
  const handleReject = async (vendorId) => {

    try {

      await rejectVendor(vendorId);

      fetchVendors();

    } catch {

      setError("Failed to reject vendor");

    }
  };

  if (loading) return <Loader />;

  return (

    <div className="vendorapproval-container">

      <div className="vendorapproval-header">

        <h2>Vendor Approval Management</h2>

        <p>
          Review and approve vendor registrations to make them active on the platform.
        </p>

      </div>

      {error && (
        <div className="vendorapproval-error">
          {error}
        </div>
      )}

      <VendorList
        vendors={vendors}
        onApprove={handleApprove}
        onReject={handleReject}
      />

    </div>

  );

};

export default VendorApproval;
