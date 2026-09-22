import React from "react";
import CustomerHeader from "./CustomerHeader";
import "../../styles/CustomerLayout.css";

const CustomerPageLayout = ({ title, children, showLogout = true, className = "" }) => {
  return (
    <div className={`dashboard-container ${className}`.trim()}>
      <main className="customer-main-panel">
        <CustomerHeader title={title} showLogout={showLogout} />
        {children}
      </main>
    </div>
  );
};

export default CustomerPageLayout;
