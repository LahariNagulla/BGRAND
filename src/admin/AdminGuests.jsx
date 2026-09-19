import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import "./AdminGuests.css";

function AdminGuests() {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      alert(error.message);
      setGuests([]);
    } else {
      const formattedGuests = (data || []).map((booking) => ({
        id: booking.booking_id || `G${booking.id}`,
        name: booking.guest || "Guest",
        phone: booking.phone || "-",
        room: booking.room || "-",
        checkIn: booking.check_in || booking.checkIn || "-",
        checkOut: booking.check_out || booking.checkOut || "-",
        guests: booking.guests || 0,
        status: booking.status || "Pending",
        bookingId: booking.id,
      }));

      setGuests(formattedGuests);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();

    const channel = supabase
      .channel("guests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const booking = payload.new;

            const guest = {
              id: booking.booking_id || `G${booking.id}`,
              name: booking.guest || "Guest",
              phone: booking.phone || "-",
              room: booking.room || "-",
              checkIn: booking.check_in || booking.checkIn || "-",
              checkOut: booking.check_out || booking.checkOut || "-",
              guests: booking.guests || 0,
              status: booking.status || "Pending",
              bookingId: booking.id,
            };

            setGuests((current) => {
              if (current.some((item) => item.bookingId === booking.id)) {
                return current;
              }
              return [guest, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            const booking = payload.new;

            setGuests((current) =>
              current.map((item) =>
                item.bookingId === booking.id
                  ? {
                      ...item,
                      id: booking.booking_id || `G${booking.id}`,
                      name: booking.guest || "Guest",
                      phone: booking.phone || "-",
                      room: booking.room || "-",
                      checkIn: booking.check_in || booking.checkIn || "-",
                      checkOut: booking.check_out || booking.checkOut || "-",
                      guests: booking.guests || 0,
                      status: booking.status || "Pending",
                    }
                  : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setGuests((current) =>
              current.filter((item) => item.bookingId !== payload.old.id)
            );

            setSelectedGuest((current) =>
              current?.bookingId === payload.old.id ? null : current
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Guests Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredGuests = guests.filter((guest) =>
    `${guest.name} ${guest.phone} ${guest.room}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-guests-page">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          BGRAND
          <span>ADMIN</span>
        </div>

        <nav className="admin-nav">

          <a href="/admin/dashboard">
            <span>▦</span>
            Dashboard
          </a>

          <a href="/admin/rooms">
            <span>⌂</span>
            Rooms
          </a>

          <a href="/admin/bookings">
            <span>▣</span>
            Bookings
          </a>

          <a href="/admin/gallery">
            <span>▧</span>
            Gallery
          </a>

          <a href="/admin/guests" className="active">
            <span>♙</span>
            Guests
          </a>

          <a
            href="/admin/settings"
            onClick={(e) => {
              e.preventDefault();
              window.location.assign("/admin/settings");
            }}
          >
            <span>⚙</span>
            Settings
          </a>

        </nav>

        <a href="/admin" className="admin-logout">
          ← Logout
        </a>

      </aside>

      <main className="admin-main">

        <motion.section
          className="guests-title-section"
          initial={{
            opacity: 0,
            scale: 0.75,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >

          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "8px",
            }}
            animate={{
              opacity: 1,
              letterSpacing: "4px",
            }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
          >
            BGRAND
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
              letterSpacing: "18px",
            }}
            animate={{
              opacity: 1,
              y: 0,
              letterSpacing: "7px",
            }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
          >
            GUESTS
          </motion.h1>

          <motion.div
            className="guests-title-line"
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: 90,
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.7,
            }}
          />

          <motion.span
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.8,
            }}
          >
            Guest Management
          </motion.span>

        </motion.section>

        <motion.section
          className="guests-content"
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
        >

          <div className="guests-heading">

            <div>
              <p>REGISTERED GUESTS</p>
              <h2>Guest Information</h2>
            </div>

            <div className="guest-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          <div className="guests-table-wrapper">

            <table className="guests-table">

              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Phone</th>
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
                      Loading guests...
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, index) => (

                  <motion.tr
                    key={guest.id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                  >

                    <td>
                      <div className="guest-name">
                        <div className="guest-avatar">
                          {guest.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{guest.name}</strong>
                          <small>{guest.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>{guest.phone}</td>

                    <td>{guest.room}</td>

                    <td>{guest.checkIn}</td>

                    <td>{guest.checkOut}</td>

                    <td>{guest.guests}</td>

                    <td>
                      <span
                        className={`guest-status ${
                          guest.status.toLowerCase()
                        }`}
                      >
                        {guest.status}
                      </span>
                    </td>

                    <td>
                      <motion.button
                        className="guest-view-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGuest(guest)}
                      >
                        View
                      </motion.button>
                    </td>

                  </motion.tr>

                  ))
                )}

              </tbody>

            </table>

            {filteredGuests.length === 0 && (
              <div className="no-guests">
                No guests found.
              </div>
            )}

          </div>

        </motion.section>

      </main>

      <AnimatePresence>

        {selectedGuest && (

          <motion.div
            className="guest-modal"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setSelectedGuest(null)}
          >

            <motion.div
              className="guest-modal-box"
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="guest-modal-close"
                onClick={() => setSelectedGuest(null)}
              >
                ×
              </button>

              <p className="guest-modal-label">
                GUEST DETAILS
              </p>

              <h2>
                {selectedGuest.name}
              </h2>

              <div className="guest-details">

                <div>
                  <span>Guest ID</span>
                  <strong>{selectedGuest.id}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedGuest.phone}</strong>
                </div>

                <div>
                  <span>Room</span>
                  <strong>{selectedGuest.room}</strong>
                </div>

                <div>
                  <span>Number of Guests</span>
                  <strong>{selectedGuest.guests}</strong>
                </div>

                <div>
                  <span>Check-in</span>
                  <strong>{selectedGuest.checkIn}</strong>
                </div>

                <div>
                  <span>Check-out</span>
                  <strong>{selectedGuest.checkOut}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong
                    className={`guest-modal-status ${
                      selectedGuest.status.toLowerCase()
                    }`}
                  >
                    {selectedGuest.status}
                  </strong>
                </div>

              </div>

              <button
                className="guest-close-btn"
                onClick={() => setSelectedGuest(null)}
              >
                Close
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

export default AdminGuests;