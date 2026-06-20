import React from "react";
import "../../styles/Dashboard.css";

const ConfirmModal = ({ open, title = "Confirm", message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
