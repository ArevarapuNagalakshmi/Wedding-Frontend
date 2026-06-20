import React, { useState } from "react";
import VendorApproval from "./VendorApproval";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {

  const [activeMenu, setActiveMenu] = useState("profile");

  const renderContent = () => {

    switch (activeMenu) {

      case "vendors":
        return <VendorApproval />;

      case "customers":
        return <h3>Customer Management (Coming Soon)</h3>;

      case "packages":
        return <h3>Service Packages Management (Coming Soon)</h3>;

      case "bookings":
        return <h3>Bookings Management (Coming Soon)</h3>;

      default:
        return (
          <div className="dashboard-cards">

            <div className="dashboard-card">
              <h3>Total Vendors</h3>
              <p>Manage and verify vendors</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Customers</h3>
              <p>View registered customers</p>
            </div>

            <div className="dashboard-card">
              <h3>Service Packages</h3>
              <p>Manage service listings</p>
            </div>

            <div className="dashboard-card">
              <h3>Bookings</h3>
              <p>Monitor all bookings</p>
            </div>

          </div>
        );
    }
  };

  return (

    <div className="admin-dashboard">

      <AdminSidebar activeMenu={activeMenu} onSelect={setActiveMenu} />

      {/* Main Content */}
      <div className="admin-content">

        <h2 className="content-title">

          {activeMenu === "profile" && "Admin Profile"}
          {activeMenu === "vendors" && "Vendor Approval"}
          {activeMenu === "customers" && "Customers"}
          {activeMenu === "packages" && "Service Packages"}
          {activeMenu === "bookings" && "Bookings"}

        </h2>

        {renderContent()}

      </div>

    </div>

  );
};

export default AdminDashboard;
