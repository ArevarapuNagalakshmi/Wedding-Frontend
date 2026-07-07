import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../../styles/EnhancedDashboard.css";
import { getMyServices, deleteService } from "../../api/serviceApi";
import { getVendorProfile } from "../../api/vendorApi";
import Loader from "../common/Loader";

// Enhanced interactive calendar component
const SimpleCalendar = ({ value, onChange, bookedDates }) => {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() - 1));
  const nextMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() + 1));
  
  const daysInMonth = getDaysInMonth(value);
  const firstDay = getFirstDayOfMonth(value);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isBooked = (day) => bookedDates.some(d => d.getDate() === day && d.getMonth() === value.getMonth() && d.getFullYear() === value.getFullYear());
  const isSelected = (day) => day === value.getDate();
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && value.getMonth() === today.getMonth() && value.getFullYear() === today.getFullYear();
  };

  return (
    <div className="enhanced-calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-btn">
          <span>←</span>
        </button>
        <h3>{value.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
        <button onClick={nextMonth} className="calendar-nav-btn">
          <span>→</span>
        </button>
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-box today"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked"></div>
          <span>Booked</span>
        </div>
      </div>
      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map(d => (
          <div key={d} className="calendar-day-name">{d}</div>
        ))}
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => day && onChange(new Date(value.getFullYear(), value.getMonth(), day))}
            className={`calendar-day ${day ? "has-date" : ""} ${isBooked(day) ? "booked" : ""} ${isSelected(day) ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projectedBookings, setProjectedBookings] = useState(1);
  const [projectedPrice, setProjectedPrice] = useState(15000);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await getVendorProfile();
        const servicesRes = await getMyServices(profileRes.data.id);
      const bookingsRes = { data: [] };

        setVendor(profileRes.data);
        setServices(servicesRes.data || []);
        setBookings(bookingsRes.data || []);

        const initialHistory = (bookingsRes.data || []).slice(0, 5).reduce((acc, booking, index) => {
          const id = booking._id || booking.id || index;
          acc[id] = [
            {
              from: "client",
              text: booking.customerMessage || `Hi, I’m interested in ${booking.serviceName || "your service"}.`,
              timestamp: booking.eventDate || new Date().toISOString(),
            },
            {
              from: "vendor",
              text: "Thanks! I can help you with that. Can we confirm the event date and package details?",
              timestamp: new Date().toISOString(),
            },
          ];
          return acc;
        }, {});

        setChatHistory(initialHistory);
        setActiveChatId(Object.keys(initialHistory)[0] || null);
      } catch (error) {
        console.error("Unable to load vendor profile data", error);
        setProfileError(
          error?.response?.data?.message ||
            "Unable to load profile data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const averagePrice = Math.round(
        services.reduce((sum, service) => sum + Number(service.price || 0), 0) /
          services.length
      );
      setProjectedPrice(averagePrice || 15000);
    }
  }, [services]);

  // Calculate income
  const totalIncome = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice || 0),
    0
  );

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.eventDate) >= new Date()
  ).length;

  const totalServices = services.length;
  const vendorLocation =
    vendor?.address || vendor?.city || vendor?.location || "Not set";

  // Get booked event dates for calendar highlighting
  const bookedDates = bookings.map((b) => new Date(b.eventDate));

  // Get events for selected date
  // Filter bookings with location data for map
  const bookingsWithLocation = bookings.filter(
    (b) =>
      b.location &&
      ((typeof b.location === "object" && b.location.latitude && b.location.longitude) ||
        (typeof b.location === "object" && b.location.address) ||
        typeof b.location === "string")
  );

  const mapLocation = bookingsWithLocation.length
    ? bookingsWithLocation[0].location
    : vendorLocation;

  const mapQuery =
    typeof mapLocation === "object"
      ? mapLocation.latitude && mapLocation.longitude
        ? `${mapLocation.latitude},${mapLocation.longitude}`
        : mapLocation.address
      : mapLocation;

  const chatThreads = bookings.length
    ? bookings.slice(0, 5).map((booking, index) => ({
        id: booking._id || booking.id || index,
        name: booking.customerName || `Client ${index + 1}`,
        latest: booking.serviceName
          ? `Booked ${booking.serviceName}`
          : "Requested a new package",
      }))
    : [
        { id: 1, name: "John Doe", latest: "Needs venue suggestions" },
        { id: 2, name: "Jane Smith", latest: "Requested quote update" },
        { id: 3, name: "Project Group", latest: "Confirmed schedule" },
      ];

  const activeChat =
    chatThreads.find((thread) => thread.id === activeChatId) || chatThreads[0];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      from: "vendor",
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }));
    setMessageInput("");
    console.log("Chat sent:", {
      chatId: activeChat.id,
      recipient: activeChat.name,
      message: newMessage.text,
    });
  };

  const handleChatSelect = (threadId) => {
    setActiveChatId(threadId);
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const activeChatMessages = chatHistory[activeChat?.id] || [];

  const appointmentItems = bookings
    .filter((booking) => new Date(booking.eventDate) >= new Date())
    .slice(0, 5)
    .map((booking, index) => ({
      id: booking._id || booking.id || index,
      date: booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "TBD",
      time: booking.eventTime || "10:00",
      title: booking.serviceName || "Event booking",
    }));

  if (loading) return <Loader />;

  return (
    <div className="vendor-dashboard-page">
      <div className="vendor-dashboard-main">

      {profileError && (
        <div className="vendor-dashboard-alert">{profileError}</div>
      )}

      <section className="vendor-main-card">
        <div className="vendor-main-card-inner">
          <div className="main-card-left">
            <div className="badge">Manage your event services</div>
            <h2>Keep your service offerings up to date for every couple.</h2>
            <p className="muted">Use this profile to track income, manage bookings, and view event locations without missing any request.</p>
            <div className="hero-ctas">
              <Link to="/vendor/add-service" className="btn btn-primary large">ADD NEW SERVICE</Link>
              <Link to="/vendor/services" className="btn btn-outline">View All Services</Link>
            </div>
          </div>
          <aside className="main-card-right">
            <div className="meta-box">
              <span>Vendor</span>
              <strong>{vendor?.businessName || 'Vendor'}</strong>
            </div>
            <div className="meta-box">
              <span>Approved</span>
              <strong>{vendor?.verified === false ? 'Pending' : 'Approved'}</strong>
            </div>
            <div className="meta-box">
              <span>Rating</span>
              <strong>{vendor?.rating?.toFixed?.(1) || 'N/A'}</strong>
            </div>
            <div className="meta-box">
              <span>Response</span>
              <strong>{vendor?.responseTime || 'Not set'}</strong>
            </div>
            <div className="meta-box">
              <span>Location</span>
              <strong>{vendorLocation}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="vendor-summary-row">
        <article className="summary-card">
          <span className="summary-title">Total Income</span>
          <strong>₹{totalIncome.toLocaleString()}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-title">Upcoming Bookings</span>
          <strong>{upcomingBookings}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-title">Active Services</span>
          <strong>{totalServices}</strong>
        </article>
        <article className="summary-card summary-card-primary">
          <span className="summary-title">Vendor Status</span>
          <strong>
            {vendor?.approved === false ? "Pending Approval" : "Live on Platform"}
          </strong>
        </article>
      </section>

      <div className="vendor-dashboard-grid">
        <aside className="vendor-left-panel">
          <div className="panel-box">
            <div className="panel-heading">Chats</div>
            <div className="panel-list">
              {chatThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  className={`panel-item chat-thread ${thread.id === activeChat?.id ? "active" : ""}`}
                  onClick={() => handleChatSelect(thread.id)}
                >
                  <div>
                    <strong>{thread.name}</strong>
                    <p style={{ margin: 0, color: "#5f7585", fontSize: "13px" }}>
                      {thread.latest}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-heading">Event Reminders</div>
            <div className="panel-list">
              {appointmentItems.length > 0 ? (
                appointmentItems.map((item) => (
                  <div key={item.id} className="panel-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p style={{ margin: 0, color: "#5f7585", fontSize: "13px" }}>
                        {item.date} · {item.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="panel-item">
                  <span>No event reminders yet.</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="vendor-center-panel">
          <div className="panel-box chat-box" id="messages">
            <div className="panel-heading">
              <div id="messages" style={{ scrollMarginTop: "100px" }}>
                {activeChat?.name || "Live Messages"}
              </div>
            </div>
            <div className="chat-content">
              {activeChatMessages.length > 0 ? (
                activeChatMessages.map((message, index) => (
                  <div key={index} className={`chat-message ${message.from === "vendor" ? "chat-vendor" : "chat-client"}`}>
                    <span className="chat-user">
                      {message.from === "vendor" ? "You:" : "Client:"}
                    </span>
                    <span>{message.text}</span>
                  </div>
                ))
              ) : (
                <div className="chat-message">
                  <span className="chat-user">Info:</span>
                  <span>Select a chat thread or start a new conversation.</span>
                </div>
              )}
            </div>
            <div className="chat-input-row">
              <input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleMessageKeyDown}
              />
              <button type="button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>

        <aside className="vendor-right-panel">
          <div className="panel-box panel-calendar">
            <div className="panel-heading">Event Calendar</div>
            <SimpleCalendar value={selectedDate} onChange={setSelectedDate} bookedDates={bookedDates} />
          </div>

          <div className="panel-box panel-map">
            <div className="panel-heading">Event Locations Map</div>
            {mapQuery ? (
              <div style={{ position: "relative" }}>
                <div className="map-location-badge">
                  {bookingsWithLocation.length > 0 ? `${bookingsWithLocation.length} Event${bookingsWithLocation.length > 1 ? 's' : ''}` : 'Your Location'}
                </div>
                <div className="map-wrapper">
                  <iframe
                    title="Event Locations"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : (
              <div className="no-bookings" style={{ padding: "18px 0" }}>
                <p>No location data available for booked events.</p>
              </div>
            )}
          </div>

          <div className="panel-box panel-calculator">
            <div className="panel-heading">Revenue Calculator</div>
            <div className="calculator-panel">
              <div className="calculator-field">
                <label htmlFor="projectedBookings">Projected bookings</label>
                <input
                  id="projectedBookings"
                  type="number"
                  min="0"
                  value={projectedBookings}
                  onChange={(e) => setProjectedBookings(Number(e.target.value))}
                />
              </div>
              <div className="calculator-field">
                <label htmlFor="projectedPrice">Average package price</label>
                <input
                  id="projectedPrice"
                  type="number"
                  min="0"
                  value={projectedPrice}
                  onChange={(e) => setProjectedPrice(Number(e.target.value))}
                />
              </div>
              <div className="calculator-result">
                <span>Projected revenue</span>
                <strong>₹{(projectedBookings * projectedPrice).toLocaleString()}</strong>
              </div>
              <p className="calculator-note">
                Use this estimate to plan marketing, package updates, and event goals.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Featured Services */}
      <section className="service-overview" id="services">
        <div id="services" style={{ scrollMarginTop: '100px' }}></div>
        <div className="section-header">
          <div>
            <h2>Featured Services</h2>
            <p>Review your top services and add new wedding packages anytime.</p>
          </div>
          <Link to="/vendor/services" className="view-all-link">
            Manage all services
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="service-preview-grid">
            {services.slice(0, 3).map((service) => (
              <div key={service._id || service.id} className="service-preview-card">
                <div className="service-card-header">
                  <h3>{service.name}</h3>
                  <span className="service-price">₹{service.price}</span>
                </div>
                <p>{service.description || "No description available."}</p>
                <div className="service-card-actions">
                  <Link
                    className="btn btn-outline"
                    to={`/vendor/edit-service/${service._id || service.id}`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="service-preview-empty">
            <p>
              No services added yet. Add your first wedding service now and
              start capturing more bookings.
            </p>
            <Link to="/vendor/add-service" className="btn btn-primary">
              Add Service
            </Link>
          </div>
        )}
      </section>

      </div>
    </div>
  );
};

export default VendorDashboard;
