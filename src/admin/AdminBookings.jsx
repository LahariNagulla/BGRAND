import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([
    {
      id: "BG001",
      guest: "Rahul Kumar",
      phone: "9876543210",
      room: "Premium Suite",
      checkIn: "20 Sep 2026",
      checkOut: "22 Sep 2026",
      guests: 2,
      status: "Pending",
    },
    {
      id: "BG002",
      guest: "Priya Sharma",
      phone: "9876543211",
      room: "Luxury Deluxe Room",
      checkIn: "21 Sep 2026",
      checkOut: "23 Sep 2026",
      guests: 2,
      status: "Confirmed",
    },
    {
      id: "BG003",
      guest: "Arjun Reddy",
      phone: "9876543212",
      room: "Executive Room",
      checkIn: "24 Sep 2026",
      checkOut: "25 Sep 2026",
      guests: 1,
      status: "Confirmed",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleStatusChange = (id, status) => {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id
          ? { ...booking, status }
          : booking
      )
    );

    setSelectedBooking((currentBooking) =>
      currentBooking
        ? { ...currentBooking, status }
        : currentBooking
    );
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

          <span>
            View and manage BGRAND guest reservations.
          </span>
        </div>
      </motion.div>


      <motion.div
        className="booking-summary"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </motion.div>


        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </motion.div>


        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
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

            {bookings.map((booking, index) => (

              <motion.tr
                key={booking.id}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  duration: 0.4,
                }}
              >

                <td>{booking.id}</td>


                <td>
                  <strong className="booking-guest">
                    {booking.guest}
                  </strong>

                  <small className="booking-phone">
                    {booking.phone}
                  </small>
                </td>


                <td className="booking-room">
                  {booking.room}
                </td>


                <td>{booking.checkIn}</td>


                <td>{booking.checkOut}</td>


                <td>{booking.guests}</td>


                <td>

                  <button
                    className={`booking-status ${
                      booking.status.toLowerCase()
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
                    {booking.status}
                  </button>

                </td>


                <td>

                  <motion.button
                    className="booking-view-btn"
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() =>
                      setSelectedBooking(booking)
                    }
                  >
                    View
                  </motion.button>

                </td>

              </motion.tr>

            ))}

          </tbody>

        </table>

      </motion.div>


      <AnimatePresence>

        {selectedBooking && (

          <motion.div
            className="booking-modal"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedBooking(null)
            }
          >

            <motion.div
              className="booking-modal-box"
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 25,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 25,
              }}
              transition={{
                duration: 0.35,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="booking-modal-close"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                ×
              </button>


              <p className="booking-modal-label">
                RESERVATION DETAILS
              </p>


              <h2>
                {selectedBooking.guest}
              </h2>


              <div className="booking-modal-details">

                <div>
                  <span>Booking ID</span>
                  <strong>{selectedBooking.id}</strong>
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
                  <strong>{selectedBooking.checkIn}</strong>
                </div>


                <div>
                  <span>Check-out</span>
                  <strong>{selectedBooking.checkOut}</strong>
                </div>

              </div>


              <div className="booking-modal-status">

                <span>Status</span>

                <button
                  className={`booking-status ${
                    selectedBooking.status.toLowerCase()
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
                  {selectedBooking.status}
                </button>

              </div>


              <div className="booking-modal-actions">

                {selectedBooking.status === "Pending" && (

                  <button
                    className="confirm-booking-btn"
                    onClick={() =>
                      handleStatusChange(
                        selectedBooking.id,
                        "Confirmed"
                      )
                    }
                  >
                    Confirm Booking
                  </button>

                )}


                {selectedBooking.status === "Confirmed" && (

                  <button
                    className="pending-booking-btn"
                    onClick={() =>
                      handleStatusChange(
                        selectedBooking.id,
                        "Pending"
                      )
                    }
                  >
                    Mark as Pending
                  </button>

                )}

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>
  );
}

export default AdminBookings;