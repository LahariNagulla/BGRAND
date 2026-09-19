import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);

    const [{ data: bookingData, error: bookingError }, { data: roomData, error: roomError }] =
      await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .order("id", { ascending: false }),
        supabase
          .from("rooms")
          .select("*")
          .order("id", { ascending: true }),
      ]);

    if (bookingError) {
      console.error("Dashboard bookings error:", bookingError);
    }

    if (roomError) {
      console.error("Dashboard rooms error:", roomError);
    }

    setBookings(bookingData || []);
    setRooms(roomData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    const bookingsChannel = supabase
      .channel("dashboard-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((current) => {
              if (current.some((item) => item.id === payload.new.id)) {
                return current;
              }
              return [payload.new, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            setBookings((current) =>
              current.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setBookings((current) =>
              current.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Dashboard Bookings Realtime Status:", status);
      });

    const roomsChannel = supabase
      .channel("dashboard-rooms-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRooms((current) => {
              if (current.some((item) => item.id === payload.new.id)) {
                return current;
              }
              return [...current, payload.new];
            });
          }

          if (payload.eventType === "UPDATE") {
            setRooms((current) =>
              current.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setRooms((current) =>
              current.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Dashboard Rooms Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(roomsChannel);
    };
  }, []);

  const totalBookings = bookings.length;
  const availableRooms = rooms.filter((room) => room.available === true).length;
  const totalGuests = bookings.reduce(
    (total, booking) => total + (Number(booking.guests) || 0),
    0
  );

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="admin-dashboard">

      <aside className="admin-sidebar">
        <div className="admin-brand">
          BGRAND
          <span>ADMIN</span>
        </div>

        <nav className="admin-nav">
          <a href="/admin/dashboard" className="active">
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

          <a
            href="/admin/guests"
            onClick={(e) => {
              e.preventDefault();
              window.location.assign("/admin/guests");
            }}
          >
            <span>♙</span>
            Guests
          </a>

          <a href="/admin/settings">
            <span>⚙</span>
            Settings
          </a>
        </nav>

        <a href="/admin" className="admin-logout">
          ← Logout
        </a>
      </aside>

      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <p>ADMINISTRATION</p>
            <h1>Dashboard</h1>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <p>WELCOME BACK</p>
          <h2>BGRAND Management Overview</h2>
          <span>
            Manage your rooms, bookings, guests and property information.
          </span>
        </section>

        <section className="dashboard-stats">

          <div className="dashboard-card">
            <span className="dashboard-card-icon">▣</span>
            <p>TOTAL BOOKINGS</p>
            <h3>{loading ? "..." : totalBookings}</h3>
            <span>Current bookings</span>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-card-icon">⌂</span>
            <p>AVAILABLE ROOMS</p>
            <h3>{loading ? "..." : String(availableRooms).padStart(2, "0")}</h3>
            <span>Rooms available</span>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-card-icon">♙</span>
            <p>TOTAL GUESTS</p>
            <h3>{loading ? "..." : totalGuests}</h3>
            <span>Registered guests</span>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-card-icon">₹</span>
            <p>REVENUE</p>
            <h3>₹0</h3>
            <span>Booking revenue</span>
          </div>

        </section>

        <section className="dashboard-content">

          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <p>RECENT ACTIVITY</p>
                <h2>Recent Bookings</h2>
              </div>

              <button
                onClick={() => (window.location.href = "/admin/bookings")}
              >
                View All
              </button>
            </div>

            <div className="booking-table">

              <div className="booking-row booking-header">
                <span>Guest</span>
                <span>Room</span>
                <span>Check-in</span>
                <span>Status</span>
              </div>

              {loading ? (
                <div className="booking-row">
                  <span>Loading...</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="booking-row">
                  <span>No bookings yet.</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div className="booking-row" key={booking.id}>
                    <span>{booking.guest || "-"}</span>
                    <span>{booking.room || "-"}</span>
                    <span>{booking.check_in || booking.checkIn || "-"}</span>
                    <strong
                      className={
                        booking.status === "Confirmed"
                          ? "status-confirmed"
                          : "status-pending"
                      }
                    >
                      {booking.status || "Pending"}
                    </strong>
                  </div>
                ))
              )}

            </div>
          </div>

          <div className="dashboard-panel quick-actions">
            <div className="panel-heading">
              <div>
                <p>MANAGEMENT</p>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/admin/rooms")}
            >
              <span>+</span>
              Add New Room
            </button>

            <button
              onClick={() => (window.location.href = "/admin/gallery")}
            >
              <span>+</span>
              Add Gallery Image
            </button>

            <button
              onClick={() => (window.location.href = "/admin/bookings")}
            >
              <span>▣</span>
              View Bookings
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;
