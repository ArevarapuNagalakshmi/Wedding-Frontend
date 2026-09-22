import React, { useState } from "react";
import { bookService } from "../../api/bookingApi";
import { useNavigate, useParams } from "react-router-dom";
import CustomerPageLayout from "./CustomerPageLayout";

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    eventDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      serviceId,
      ...booking,
    };

    await bookService(bookingData);
    navigate("/customer");
  };

  return (
    <CustomerPageLayout
      title="Book Service"
      className="customer-book-service-page"
    >
      <div className="container mt-4">
        <h3>Book Service</h3>
        <form onSubmit={handleSubmit}>
        <input
          type="date"
          className="form-control mb-3"
          name="eventDate"
          onChange={handleChange}
          required
        />
        <textarea
          className="form-control mb-3"
          name="notes"
          placeholder="Additional Notes"
          onChange={handleChange}
        />
        <button className="btn btn-success">Confirm Booking</button>
      </form>
      </div>
    </CustomerPageLayout>
  );
};

export default BookService;
