import React from "react";
import "../../styles/Dashboard.css";

const VendorLayout = ({ children }) => {
  return (
    <div className="vendor-dashboard-page">
      <div className="vendor-dashboard-main">
        {children}
      </div>
    </div>
  );
};

export default VendorLayout;
