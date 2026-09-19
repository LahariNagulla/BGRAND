import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import "./AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      alert(error.message);
      setBookings([]);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((currentBookings) => {
              const exists = currentBookings.some(
                (booking) => booking.id === payload.new.id
              );

              if (exists) return currentBookings;

              return [payload.new, ...currentBookings];
            });
          }

          if (payload.eventType === "UPDATE") {
            setBookings((currentBookings) =>
              currentBookings.map((booking) =>
                booking.id === payload.new.id
                  ? payload.new
                  : booking
              )
            );

            setSelectedBooking((currentBooking) =>
              currentBooking && currentBooking.id === payload.new.id
                ? payload.new
                : currentBooking
            );
          }

          if (payload.eventType === "DELETE") {
            setBookings((currentBookings) =>
              currentBookings.filter(
                (booking) => booking.id !== payload.old.id
              )
            );

            setSelectedBooking((currentBooking) =>
              currentBooking && currentBooking.id === payload.old.id
                ? null
                : currentBooking
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Bookings Realtime Status:", status);

        if (status === "CHANNEL_ERROR") {
          console.error("Bookings Realtime channel error");
        }

        if (status === "TIMED_OUT") {
          console.error("Bookings Realtime connection timed out");
        }

        if (status === "CLOSED") {
          console.warn("Bookings Realtime channel closed");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id, status) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating booking:", error);
      alert(error.message);
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );

    setSelectedBooking((currentBooking) =>
      currentBooking && currentBooking.id === id
        ? { ...currentBooking, status }
        : currentBooking
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting booking:", error);
      alert(error.message);
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== id)
    );

    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  return (
    <motion.div
      className="admin-bookings-page"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="bookings-page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div>
          <p>BOOKING MANAGEMENT</p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 40,
              letterSpacing: "15px",
            }}
            animate={{
              opacity: 1,
              y: 0,
              letterSpacing: "0px",
            }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            Bookings
          </motion.h1>

          <span>View and manage BGRAND guest reservations.</span>
        </div>
      </motion.div>

      <motion.div
        className="booking-summary"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <span>Confirmed</span>
          <strong>{confirmedCount}</strong>
        </motion.div>
      </motion.div>

      <motion.div
        className="bookings-table-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.4 + index * 0.1,
                    duration: 0.4,
                  }}
                >
                  <td>{booking.booking_id || booking.id}</td>

                  <td>
                    <strong className="booking-guest">
                      {booking.guest}
                    </strong>
                    <small className="booking-phone">
                      {booking.phone}
                    </small>
                  </td>

                  <td className="booking-room">{booking.room}</td>

                  <td>{booking.check_in || booking.checkIn}</td>

                  <td>{booking.check_out || booking.checkOut}</td>

                  <td>{booking.guests}</td>

                  <td>
                    <button
                      className={`booking-status ${
                        (booking.status || "Pending").toLowerCase()
                      }`}
                      onClick={() =>
                        handleStatusChange(
                          booking.id,
                          booking.status === "Pending"
                            ? "Confirmed"
                            : "Pending"
                        )
                      }
                    >
                      {booking.status || "Pending"}
                    </button>
                  </td>

                  <td>
                    <motion.button
                      className="booking-view-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View
                    </motion.button>

                    <button
                      className="booking-delete-btn"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              className="booking-modal-box"
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="booking-modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>

              <p className="booking-modal-label">RESERVATION DETAILS</p>

              <h2>{selectedBooking.guest}</h2>

              <div className="booking-modal-details">
                <div>
                  <span>Booking ID</span>
                  <strong>
                    {selectedBooking.booking_id || selectedBooking.id}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedBooking.phone}</strong>
                </div>

                <div>
                  <span>Room</span>
                  <strong>{selectedBooking.room}</strong>
                </div>

                <div>
                  <span>Guests</span>
                  <strong>{selectedBooking.guests}</strong>
                </div>

                <div>
                  <span>Check-in</span>
                  <strong>
                    {selectedBooking.check_in || selectedBooking.checkIn}
                  </strong>
                </div>

                <div>
                  <span>Check-out</span>
                  <strong>
                    {selectedBooking.check_out || selectedBooking.checkOut}
                  </strong>
                </div>
              </div>

              <div className="booking-modal-status">
                <span>Status</span>

                <button
                  className={`booking-status ${
                    (selectedBooking.status || "Pending").toLowerCase()
                  }`}
                  onClick={() =>
                    handleStatusChange(
                      selectedBooking.id,
                      selectedBooking.status === "Pending"
                        ? "Confirmed"
                        : "Pending"
                    )
                  }
                >
                  {selectedBooking.status || "Pending"}
                </button>
              </div>

              <div className="booking-modal-actions">
                {selectedBooking.status === "Pending" && (
                  <button
                    className="confirm-booking-btn"
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "Confirmed")
                    }
                  >
                    Confirm Booking
                  </button>
                )}

                {selectedBooking.status === "Confirmed" && (
                  <button
                    className="pending-booking-btn"
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "Pending")
                    }
                  >
                    Mark as Pending
                  </button>
                )}

                <button
                  className="booking-delete-btn"
                  onClick={() => handleDelete(selectedBooking.id)}
                >
                  Delete Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AdminBookings;
