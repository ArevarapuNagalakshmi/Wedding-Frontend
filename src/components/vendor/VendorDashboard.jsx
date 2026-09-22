import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../../styles/EnhancedDashboard.css";
import { getMyServices } from "../../api/serviceApi";
import { getVendorBookings, getVendorProfile } from "../../api/vendorApi";
import { getChatHistory, sendChatMessage } from "../../api/chatApi";
import Loader from "../common/Loader";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";

// Enhanced interactive calendar component
const SimpleCalendar = ({ value, onChange, bookedDates = [] }) => {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() - 1));
  const nextMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() + 1));

  const daysInMonth = getDaysInMonth(value);
  const firstDay = getFirstDayOfMonth(value);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isBooked = (day) =>
    bookedDates.some(
      (d) =>
        d instanceof Date &&
        !isNaN(d.getTime()) &&
        d.getDate() === day &&
        d.getMonth() === value.getMonth() &&
        d.getFullYear() === value.getFullYear()
    );
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
};

const VendorDashboard = ({ showMetrics = true }) => {
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [missingProfile, setMissingProfile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [eventDetailsType, setEventDetailsType] = useState(null);
  const chatContentRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setProfileError("");
        setMissingProfile(false);

        const profileRes = await getVendorProfile();
        const vendorData = profileRes?.data || null;

        if (!vendorData?.id) {
          throw new Error("Vendor profile data is missing.");
        }

        const [servicesRes, bookingsRes] = await Promise.all([
          getMyServices(vendorData.id),
          getVendorBookings(),
        ]);
        const serviceData = Array.isArray(servicesRes?.data) ? servicesRes.data : [];
        const bookingData = Array.isArray(bookingsRes?.data) ? bookingsRes.data : [];

        setVendor(vendorData);
        setServices(serviceData);
        setBookings(bookingData);

        const initialHistory = bookingData.slice(0, 5).reduce((acc, booking, index) => {
          const id = booking.userId || booking._id || booking.id || index;
          acc[id] = [
            {
              from: "client",
              text: booking.customerMessage || `Hi, I’m interested in ${booking.serviceName || "your service"}.`,
              timestamp: booking.eventDate || booking.date || new Date().toISOString(),
            },
            {
              from: "vendor",
              text: "Thanks! I can help you with that. Can we confirm the event date and package details?",
              timestamp: new Date().toISOString(),
            },
          ];
          return acc;
        }, {});

        setChatHistory((currentHistory) => ({ ...initialHistory, ...currentHistory }));
        setActiveChatId((currentId) => currentId || Object.keys(initialHistory)[0] || null);
      } catch (error) {
        console.error("Unable to load vendor profile data", error);
        const status = error?.response?.status;

        if (status === 404) {
          setMissingProfile(true);
          setVendor(null);
          setServices([]);
          setBookings([]);
          setProfileError("Vendor profile not found. Create your profile to get started.");
        } else {
          setProfileError(
            error?.response?.data?.message ||
              "Unable to load profile data. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const refreshTimer = window.setInterval(fetchDashboardData, 10000);

    return () => window.clearInterval(refreshTimer);
  }, []);

  const vendorLocation =
    vendor?.address || vendor?.city || vendor?.location || "Not set";

  // Get booked event dates for calendar highlighting
  const bookedDates = bookings
    .filter((b) => b?.eventDate || b?.date)
    .map((b) => new Date(b.eventDate || b.date))
    .filter((date) => !isNaN(date.getTime()));

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
        id: booking.userId || booking._id || booking.id || index,
        receiverId: booking.userId || null,
        name: booking.customerName || `Client ${index + 1}`,
        latest: booking.serviceName
          ? `Booked ${booking.serviceName}`
          : "Requested a new package",
      }))
    : [];

  const activeChat =
    chatThreads.find((thread) => thread.id === activeChatId) || chatThreads[0];

  useEffect(() => {
    if (!activeChat?.receiverId) return undefined;

    let cancelled = false;
    const loadChatHistory = async () => {
      try {
        setChatError("");
        const response = await getChatHistory(activeChat.receiverId);
        if (cancelled) return;

        const messages = (Array.isArray(response?.data) ? response.data : []).map((message) => ({
          from: message.senderId === activeChat.receiverId ? "client" : "vendor",
          text: message.content,
          timestamp: message.timestamp,
        }));
        setChatHistory((currentHistory) => ({
          ...currentHistory,
          [activeChat.id]: messages,
        }));
      } catch (error) {
        if (!cancelled) setChatError("Unable to load this conversation.");
      }
    };

    loadChatHistory();
    return () => {
      cancelled = true;
    };
  }, [activeChat?.id, activeChat?.receiverId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat?.receiverId) {
      if (messageInput.trim() && activeChat && !activeChat.receiverId) {
        setChatError("A customer conversation is required before sending a message.");
      }
      return;
    }

    const text = messageInput.trim();
    const newMessage = {
      from: "vendor",
      text,
      timestamp: new Date().toISOString(),
    };

    try {
      setSendingMessage(true);
      setChatError("");

      const response = await sendChatMessage(activeChat.receiverId, text);
      const savedMessage = response?.data || newMessage;

      setChatHistory((prev) => ({
        ...prev,
        [activeChat.id]: [
          ...(prev[activeChat.id] || []),
          {
            from: "vendor",
            text: savedMessage.content || text,
            timestamp: savedMessage.timestamp || newMessage.timestamp,
          },
        ],
      }));
      setMessageInput("");
    } catch (error) {
      setChatError(error?.response?.data?.message || "Unable to send this message.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleChatSelect = (threadId) => {
    setActiveChatId(threadId);
  };

  const activeChatMessages = chatHistory[activeChat?.id] || [];

  useEffect(() => {
    const chatContent = chatContentRef.current;
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [activeChat?.id, activeChatMessages.length]);

  const appointmentItems = bookings
    .filter((booking) => new Date(booking.eventDate || booking.date) >= new Date())
    .slice(0, 5)
    .map((booking, index) => ({
      id: booking._id || booking.id || index,
      date: booking.eventDate || booking.date
        ? new Date(booking.eventDate || booking.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "TBD",
      time: booking.eventTime || "10:00",
      title: booking.serviceName || "Event booking",
    }));

  const activeBookings = bookings.filter(
    (booking) => !["cancelled", "canceled", "rejected"].includes(String(booking.status || "").toLowerCase())
  );
  const now = new Date();
  const upcomingEventBookings = activeBookings.filter((booking) => {
    const eventDate = new Date(booking.eventDate || booking.date);
    return !Number.isNaN(eventDate.getTime()) && eventDate >= now;
  });
  const completedEventBookings = activeBookings.filter((booking) => {
    const status = String(booking.status || "").toLowerCase();
    const eventDate = new Date(booking.eventDate || booking.date);
    return status === "completed" || status === "complete" ||
      (!Number.isNaN(eventDate.getTime()) && eventDate < now);
  });
  const upcomingEvents = upcomingEventBookings.length;
  const completedEvents = completedEventBookings.length;
  const getBookingTotal = (booking) =>
    Number(booking.totalPrice || booking.totalAmount || booking.price || booking.amount || 0);
  const getBookingReceived = (booking) => {
    const total = getBookingTotal(booking);
    const received = Number(
      booking.receivedAmount || booking.paidAmount || booking.amountPaid ||
        (String(booking.paymentStatus || "").toLowerCase() === "paid" ? total : 0)
    );
    return Math.min(Math.max(received, 0), total);
  };
  const pendingEventBookings = activeBookings.filter(
    (booking) => getBookingTotal(booking) - getBookingReceived(booking) > 0
  );
  const receivedEventBookings = activeBookings.filter(
    (booking) => getBookingReceived(booking) > 0
  );
  const earnings = activeBookings.reduce((totals, booking) => {
    const total = getBookingTotal(booking);
    const received = getBookingReceived(booking);
    totals.total += total;
    totals.received += Math.min(Math.max(received, 0), total);
    return totals;
  }, { total: 0, received: 0 });
  const pendingEarnings = Math.max(earnings.total - earnings.received, 0);
  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
  const formatEventDate = (booking) => {
    const date = booking.eventDate || booking.date;
    if (!date) return "Not provided";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "Not provided"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };
  const getEventLocation = (booking) =>
    booking.location?.address || booking.location || booking.venue || "Not provided";
  const eventDetailsBookings = eventDetailsType === "upcoming"
    ? upcomingEventBookings
    : eventDetailsType === "completed"
    ? completedEventBookings
    : eventDetailsType === "pending"
    ? pendingEventBookings
    : eventDetailsType === "received"
    ? receivedEventBookings
    : activeBookings;
  const eventDetailsTitle = eventDetailsType === "upcoming"
    ? "Upcoming event details"
    : eventDetailsType === "completed"
    ? "Completed event details"
    : eventDetailsType === "pending"
    ? "Pending earnings details"
    : eventDetailsType === "received"
    ? "Received earnings details"
    : eventDetailsType === "total"
    ? "Total event details"
    : "Total earnings details";

  if (loading) return <Loader />;

  return (
    <>
      {profileError && !missingProfile && (
        <div className="vendor-dashboard-alert">{profileError}</div>
      )}

      {showMetrics && (
      <section className="vendor-dashboard-metrics" aria-label="Vendor performance summary">
        <button
          type="button"
          className="metric-events metric-events-button"
          onClick={() => setEventDetailsType("total")}
          aria-label="View total event details"
        >
          <div className="metric-icon"><FaCalendarAlt /></div>
          <span>Total events</span>
          <strong>{activeBookings.length}</strong>
        </button>
        <button
          type="button"
          className="metric-upcoming metric-events-button"
          onClick={() => setEventDetailsType("upcoming")}
          aria-label="View upcoming event details"
        >
          <div className="metric-icon"><FaClock /></div>
          <span>Upcoming events</span>
          <strong>{upcomingEvents}</strong>
        </button>
        <button
          type="button"
          className="metric-completed metric-events-button"
          onClick={() => setEventDetailsType("completed")}
          aria-label="View completed event details"
        >
          <div className="metric-icon"><FaCheckCircle /></div>
          <span>Completed events</span>
          <strong>{completedEvents}</strong>
        </button>
        <button
          type="button"
          className="metric-pending metric-events-button"
          onClick={() => setEventDetailsType("pending")}
          aria-label="View pending earnings details"
        >
          <div className="metric-icon"><FaWallet /></div>
          <span>Pending earnings</span>
          <strong>{formatCurrency(pendingEarnings)}</strong>
        </button>
        <button
          type="button"
          className="metric-received metric-events-button"
          onClick={() => setEventDetailsType("received")}
          aria-label="View received earnings details"
        >
          <div className="metric-icon"><FaMoneyBillWave /></div>
          <span>Received earnings</span>
          <strong>{formatCurrency(earnings.received)}</strong>
        </button>
        <button
          type="button"
          className="vendor-dashboard-metric-total metric-total metric-events-button"
          onClick={() => setEventDetailsType("total-earnings")}
          aria-label="View total earnings details"
        >
          <div className="metric-icon"><FaChartLine /></div>
          <span>Total earnings</span>
          <strong>{formatCurrency(earnings.total)}</strong>
        </button>
      </section>
      )}

      {eventDetailsType && (
        <div className="event-details-overlay" role="presentation" onClick={() => setEventDetailsType(null)}>
          <section
            className="event-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-details-header">
              <div>
                <span className="dashboard-badge">
                  {eventDetailsType === "total-earnings" || eventDetailsType === "pending" || eventDetailsType === "received"
                    ? "Payment summary"
                    : "Event schedule"}
                </span>
                <h2 id="event-details-title">{eventDetailsTitle}</h2>
              </div>
              <button
                type="button"
                className="event-details-close"
                onClick={() => setEventDetailsType(null)}
                aria-label="Close event details"
              >
                ×
              </button>
            </div>

            {eventDetailsType === "total-earnings" ? (
              <div className="event-details-grid">
                <p><strong>Earned amount</strong><span>{formatCurrency(earnings.received)}</span></p>
                <p><strong>Total amount earned</strong><span>{formatCurrency(earnings.total)}</span></p>
              </div>
            ) : eventDetailsType === "pending" && eventDetailsBookings.length === 0 ? (
              <div className="event-details-grid">
                <p><strong>Pending amount</strong><span>{formatCurrency(pendingEarnings)}</span></p>
                <p><strong>Status</strong><span>No pending payments</span></p>
              </div>
            ) : eventDetailsType === "received" && eventDetailsBookings.length === 0 ? (
              <div className="event-details-grid">
                <p><strong>Received amount</strong><span>{formatCurrency(earnings.received)}</span></p>
                <p><strong>Remaining amount</strong><span>{formatCurrency(pendingEarnings)}</span></p>
              </div>
            ) : eventDetailsBookings.length > 0 ? (
              <div className="event-details-list">
                {eventDetailsBookings.map((booking, index) => (
                  <article className="event-details-item" key={booking.id || booking._id || index}>
                    <h3>{booking.eventName || booking.serviceName || "Wedding event"}</h3>
                    <div className="event-details-grid">
                      <p><strong>Event date</strong><span>{formatEventDate(booking)}</span></p>
                      <p><strong>Time</strong><span>{booking.eventTime || booking.time || "Not provided"}</span></p>
                      <p><strong>Place / location</strong><span>{getEventLocation(booking)}</span></p>
                      <p><strong>Total payment</strong><span>{formatCurrency(getBookingTotal(booking))}</span></p>
                      <p><strong>Received amount</strong><span>{formatCurrency(getBookingReceived(booking))}</span></p>
                      <p><strong>Remaining amount</strong><span>{formatCurrency(Math.max(getBookingTotal(booking) - getBookingReceived(booking), 0))}</span></p>
                      {eventDetailsType === "pending" && (
                        <p><strong>Pending amount</strong><span>{formatCurrency(getBookingTotal(booking) - getBookingReceived(booking))}</span></p>
                      )}
                      <p><strong>Status</strong><span>{booking.status || "Not provided"}</span></p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="event-details-empty">
                <h3>No {eventDetailsType} events yet</h3>
                <p>Event name, date, time, location, payment, and status will appear here when a matching booking is available.</p>
              </div>
            )}
          </section>
        </div>
      )}

      <>
      <div className="vendor-dashboard-grid" aria-label="Vendor operations dashboard">
        <aside className="vendor-left-panel" aria-label="Appointments and chat list">
          <div className="panel-box vendor-appointments-panel">
            <div className="panel-heading">Appointments</div>
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

          <div className="panel-box vendor-chat-list-panel">
            <div className="panel-heading">Chat list</div>
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
        </aside>

        <main className="vendor-center-panel" aria-label="Active chat conversation">
          <div className="panel-box chat-box">
            <div className="panel-heading">
              <div style={{ scrollMarginTop: "100px" }}>
                {activeChat?.name || "Messages"}
              </div>
            </div>
            <div className="chat-content" ref={chatContentRef}>
              {chatError && <div className="chat-error">{chatError}</div>}
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
            <form className="chat-input-row" onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}>
              <input
                type="text"
                placeholder="Type a message..."
                aria-label="Type a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!activeChat || sendingMessage}
              />
              <button type="submit" disabled={!messageInput.trim() || !activeChat || sendingMessage}>
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </main>

        <aside className="vendor-right-panel" aria-label="Calendar and event locations">
          <div className="panel-box panel-calendar">
            <div className="panel-heading">Appointment calendar</div>
            <SimpleCalendar value={selectedDate} onChange={setSelectedDate} bookedDates={bookedDates} />
          </div>

          <div className="panel-box panel-map">
            <div className="panel-heading">Event locations</div>
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

        </aside>
      </div>

      {/* Featured Services */}
      <section className="service-overview" id="services">
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
      </>

    </>
  );
};

export default VendorDashboard;
