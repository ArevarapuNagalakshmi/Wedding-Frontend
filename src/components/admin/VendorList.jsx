import React from "react";
import "../../styles/VendorList.css";

const VendorList = ({ vendors, onApprove, onReject }) => {

  return (
    <div className="vendorlist-container">

      <h2 className="vendorlist-title">
        Vendor Approval Management
      </h2>

      <div className="vendorlist-table-wrapper">

        <table className="vendorlist-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {vendors.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No vendors found
                </td>
              </tr>
            ) : (

              vendors.map((vendor) => (

                <tr key={vendor.id}>

                  <td>{vendor.name}</td>

                  <td>{vendor.email}</td>

                  <td>{vendor.serviceType}</td>

                  <td>

                    <span className={
                      vendor.approved
                        ? "status-approved"
                        : "status-pending"
                    }>
                      {vendor.approved ? "Approved" : "Pending"}
                    </span>

                  </td>

                  <td>

                    {!vendor.approved && (
                      <div className="action-buttons">

                        <button
                          className="approve-btn"
                          onClick={() => onApprove(vendor.id)}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => onReject(vendor.id)}
                        >
                          Reject
                        </button>

                      </div>
                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default VendorList;
