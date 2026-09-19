import { supabase } from "./lib/supabase";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./App.css";
import Admin from "./admin/Admin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminRooms from "./admin/AdminRooms";
import AdminBookings from "./admin/AdminBookings";
import AdminGallery from "./admin/AdminGallery";
import AdminGuests from "./admin/AdminGuests";
import AdminSettings from "./admin/AdminSettings";

function App() {
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  if (window.location.pathname === "/admin/dashboard") {
    return <AdminDashboard />;
  }

  if (window.location.pathname === "/admin/rooms") {
    return <AdminRooms />;
  }

  if (window.location.pathname === "/admin/bookings") {
    return <AdminBookings />;
  }

  if (window.location.pathname === "/admin/gallery") {
    return <AdminGallery />;
  }
  if (window.location.pathname === "/admin/guests") {
    return <AdminGuests />;
  }

  if (window.location.pathname === "/admin/settings") {
    return <AdminSettings />;
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [bookingRoom, setBookingRoom] = useState("");

  const navItems = [
    "Home",
    "Experience",
    "Rooms",
    "Gallery",
    "About",
    "Contact",
  ];

  const [rooms, setRooms] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching rooms:", error);
        return;
      }

      const formattedRooms = (data || []).map((room) => ({
        ...room,
        images: [
          ...(room.image ? [room.image] : []),
          ...(Array.isArray(room.extra_images) ? room.extra_images : [])
        ].length
          ? [
              ...(room.image ? [room.image] : []),
              ...(Array.isArray(room.extra_images) ? room.extra_images : [])
            ]
          : ["/bgrand-gallery-1.jpg"],
        features: Array.isArray(room.features) ? room.features : []
      }));

      setRooms(formattedRooms);
    };

    fetchRooms();

    const channel = supabase
      .channel("client-rooms-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          const buildRoom = (room) => {
            return {
              ...room,
              images: [
                ...(room.image ? [room.image] : []),
                ...(Array.isArray(room.extra_images) ? room.extra_images : [])
              ].length
                ? [
                    ...(room.image ? [room.image] : []),
                    ...(Array.isArray(room.extra_images) ? room.extra_images : [])
                  ]
                : ["/bgrand-gallery-1.jpg"],
              features: Array.isArray(room.features) ? room.features : []
            };
          };

          if (payload.eventType === "INSERT") {
            setRooms((current) => {
              if (current.some((item) => item.id === payload.new.id)) {
                return current;
              }
              return [...current, buildRoom(payload.new)];
            });
          }

          if (payload.eventType === "UPDATE") {
            setRooms((current) =>
              current.map((item) =>
                item.id === payload.new.id ? buildRoom(payload.new) : item
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
        console.log("Client Rooms Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching gallery:", error);
        return;
      }

      setGalleryImages(data || []);
    };

    fetchGallery();

    const channel = supabase
      .channel("client-gallery-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "gallery",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setGalleryImages((current) => {
              const exists = current.some(
                (item) => item.id === payload.new.id
              );
              if (exists) return current;
              return [...current, payload.new];
            });
          }

          if (payload.eventType === "UPDATE") {
            setGalleryImages((current) =>
              current.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setGalleryImages((current) =>
              current.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Client Gallery Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      setSiteSettings(data || null);
    };

    fetchSettings();

    const channel = supabase
      .channel("client-settings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setSiteSettings(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setCurrentImage(0);
  };

  const closeRoomDetails = () => {
    setSelectedRoom(null);
    setCurrentImage(0);
  };

  const openBooking = (roomName = "") => {
    setBookingRoom(roomName);
    closeRoomDetails();

    setTimeout(() => {
      document
        .getElementById("contact")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const nextImage = () => {
    if (!selectedRoom) return;

    setCurrentImage(
      (prev) =>
        (prev + 1) % selectedRoom.images.length
    );
  };

  const previousImage = () => {
    if (!selectedRoom) return;

    setCurrentImage(
      (prev) =>
        (prev - 1 + selectedRoom.images.length) %
        selectedRoom.images.length
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const room = formData.get("room");
    const checkIn = formData.get("checkIn");
    const checkOut = formData.get("checkOut");
    const guests = formData.get("guests");

    const bookingId = `BG${Date.now()}`;

    const booking = {
      booking_id: bookingId,
      guest: name,
      phone,
      room,
      check_in: checkIn,
      check_out: checkOut,
      guests: Number(guests),
      status: "Pending",
    };

    const { error } = await supabase
      .from("bookings")
      .insert(booking);

    if (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
      return;
    }

    const message = `Hello BGRAND,

I would like to make a booking.

Booking ID: ${bookingId}
Room: ${room || "Not selected"}
Name: ${name}
Phone: ${phone}
Check-in: ${checkIn}
Check-out: ${checkOut}
Guests: ${guests}`;

    const whatsappNumber = siteSettings?.whatsapp_number || siteSettings?.contact_number || "";
    const whatsappDigits = String(whatsappNumber).replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    alert("Booking request submitted successfully!");

    e.target.reset();
    setBookingRoom("");
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <motion.header
        className="navbar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.a
          href="#home"
          className="logo"
          onClick={closeMenu}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          whileHover={{
            scale: 1.05,
            textShadow:
              "0 0 20px rgba(226, 196, 141, 0.6)",
          }}
        >
          BGRAND
        </motion.a>

        <nav className="nav-links">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.08,
              }}
              whileHover={{
                y: -3,
                scale: 1.04,
                textShadow:
                  "0 0 12px rgba(226, 196, 141, 0.5)",
              }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <motion.button
          className="book-btn"
          onClick={() => openBooking("")}
          whileHover={{
            scale: 1.05,
            y: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <span>Book Your Stay</span>
        </motion.button>

        <motion.button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          whileTap={{
            scale: 0.9,
          }}
        >
          <span
            className={
              menuOpen ? "bar open" : "bar"
            }
          ></span>

          <span
            className={
              menuOpen ? "bar open" : "bar"
            }
          ></span>

          <span
            className={
              menuOpen ? "bar open" : "bar"
            }
          ></span>
        </motion.button>
      </motion.header>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMenu}
                initial={{
                  opacity: 0,
                  x: -25,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
              >
                {item}
              </motion.a>
            ))}

            <motion.button
              className="mobile-book-btn"
              onClick={() => {
                closeMenu();
                openBooking("");
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              Book Your Stay
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}

      <section id="home" className="hero">
        <motion.img
          src="/bgrand-hero.jpg"
          alt={siteSettings?.property_name || siteSettings?.propertyName || "BGRAND Homestay"}
          className="hero-image"
          initial={{
            opacity: 0,
            scale: 1.04,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
          }}
        />

        <motion.button
          type="button"
          className="explore-stay"
          onClick={() =>
            document
              .getElementById("experience")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 1.2,
          }}
        >
          <span>Explore Stay</span>
          <span className="arrow">↓</span>
        </motion.button>
      </section>

      {/* EXPERIENCE */}

      <section
        id="experience"
        className="experience-section"
      >
        <motion.div
          className="experience-content"
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          <p className="experience-label">
            A GLIMPSE OF BGRAND
          </p>

          <h2>Experience BGRAND</h2>

          <p className="experience-text">
            Discover the spaces, comfort and atmosphere
            that make your stay special.
          </p>
        </motion.div>

        <motion.div
          className="experience-video"
          initial={{
            opacity: 0,
            y: 70,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
          }}
        >
          <video
            src="/bgrand-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
      </section>

      {/* ROOMS */}

      <section
        id="rooms"
        className="rooms-section"
      >
        <motion.div
          className="rooms-heading"
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >
          <p className="rooms-label">
            STAY WITH US
          </p>

          <h2>Rooms & Accommodation</h2>

          <p className="rooms-description">
            Discover thoughtfully designed spaces created
            for comfort, relaxation and memorable stays.
          </p>
        </motion.div>

        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <motion.article
              className="room-card"
              key={room.name}
              initial={{
                opacity: 0,
                y: 80,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
              }}
            >
              <div className="room-image-wrapper">
                <motion.img
                  src={room.images[0]}
                  alt={room.name}
                  className="room-image"
                  whileHover={{
                    scale: 1.08,
                  }}
                />

                <div className="room-image-overlay"></div>
              </div>

              <div className="room-content">
                <div className="room-top">
                  <h3>{room.name}</h3>

                  <div className="room-price">
                    <span>From</span>
                    <strong>{siteSettings?.currency || "₹"}{Number(room.price).toLocaleString("en-IN")}</strong>
                    <small>/ night</small>
                  </div>
                </div>

                <p className="room-description">
                  {room.description}
                </p>

                <div className="room-features">
                  {room.features.map((feature) => (
                    <span key={feature}>
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="room-actions">
                  <motion.button
                    onClick={() =>
                      openRoomDetails(room)
                    }
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    View Details
                  </motion.button>

                  <motion.button
                    onClick={() =>
                      openBooking(room.name)
                    }
                    whileHover={{
                      scale: 1.04,
                      x: 3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    Book Stay
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* GALLERY */}

      <section
        id="gallery"
        className="gallery-section"
      >
        <motion.div
          className="gallery-heading"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <p>EXPLORE BGRAND</p>

          <h2>
            Our <span>Gallery</span>
          </h2>

          <div className="gallery-line"></div>

          <p className="gallery-description">
            Take a closer look at the rooms, interiors and
            comfortable spaces at BGRAND.
          </p>
        </motion.div>

        <div className="gallery-grid">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.id}
              className={`gallery-item ${
                index === 0
                  ? "gallery-large"
                  : index === galleryImages.length - 1
                  ? "gallery-wide"
                  : ""
              }`}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
            >
              <img
                src={item.image}
                alt={item.title}
              />

              <div className="gallery-overlay">
                <span>BGRAND</span>
                <strong>{item.title}</strong>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="about-section"
      >
        <motion.div
          className="about-image"
          initial={{
            opacity: 0,
            x: -60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          <img
            src="/bgrand-gallery-2.jpg"
            alt="BGRAND interior"
          />
        </motion.div>

        <motion.div
          className="about-content"
          initial={{
            opacity: 0,
            x: 60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          <p className="about-label">
            ABOUT {siteSettings?.property_name || siteSettings?.propertyName || "BGRAND"}
          </p>

          <h2>
            A Comfortable Stay,
            <span> Made for You</span>
          </h2>

          <p className="about-text">
            BGRAND offers a comfortable and welcoming
            stay for guests looking for a peaceful place
            to relax and enjoy their time.
          </p>

          <p className="about-text">
            With thoughtfully arranged rooms, spacious
            interiors and essential amenities, we aim to
            make every stay simple, comfortable and
            memorable.
          </p>

          <div className="about-features">

            <div>
              <strong>Comfort</strong>
              <span>
                Thoughtfully designed rooms
              </span>
            </div>

            <div>
              <strong>Hospitality</strong>
              <span>
                Warm and welcoming service
              </span>
            </div>

            <div>
              <strong>Experience</strong>
              <span>
                A peaceful stay at BGRAND
              </span>
            </div>

          </div>
        </motion.div>
      </section>

      {/* LOCATION / MAP */}

      <section className="bgrand-location-section">
          <motion.div
            className="stay-map"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="stay-map-inner">

              <div className="map-pin">📍</div>

              <p className="map-label">
                FIND BGRAND
              </p>

              <h3>Visit Us</h3>

              <p className="map-text">
                {siteSettings?.property_address || "BGRAND"}
              </p>

              <p className="map-text">
                {siteSettings?.property_address || "Find BGRAND easily and get directions to your stay."}
              </p>

              <a
                href="https://maps.app.goo.gl/fcka19Y9h8ZJJvha7?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                Get Directions
                <span>→</span>
              </a>

            </div>
          </motion.div>
      </section>

      {/* CONTACT / BOOKING */}

      <motion.section
        id="contact"
        className="section booking-section"
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
      >
        <p>PLAN YOUR STAY</p>

        <h2>Book Your Stay</h2>

        <p>Check-in: {siteSettings?.check_in_time || "2:00 PM"} | Check-out: {siteSettings?.check_out_time || "11:00 AM"}</p>

        <form
          className="booking-form"
          onSubmit={handleBookingSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
          />

          <select
            name="room"
            value={bookingRoom}
            onChange={(e) =>
              setBookingRoom(e.target.value)
            }
            required
          >
            <option value="">
              Select Room
            </option>

            {rooms.map((room) => (
              <option
                key={room.name}
                value={room.name}
              >
                {room.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="checkIn"
            required
          />

          <input
            type="date"
            name="checkOut"
            required
          />

          <select name="guests" required>
            <option value="">Number of Guests</option>
            {Array.from(
              { length: Number(siteSettings?.maximum_guests) || 5 },
              (_, index) => index + 1
            ).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>

          <button type="submit">
            Send Booking Request
          </button>
        </form>
      </motion.section>

      {/* STAY CONNECTED */}

      <section
        id="stay-connected"
        className="stay-connected-section"
      >
        <motion.div
          className="stay-connected-heading"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="stay-label">
            STAY WITH BGRAND
          </p>

          <h2>
            Thank You for Choosing <span>{siteSettings?.property_name || siteSettings?.propertyName || "BGRAND"}</span>
          </h2>

          <div className="stay-line"></div>

          <p className="stay-message">
            Thank you for choosing {siteSettings?.property_name || siteSettings?.propertyName || "BGRAND"}. We look forward to welcoming you
            and making your stay comfortable and memorable.
          </p>
        </motion.div>

        <div className="stay-connected-content">

          <motion.div
            className="stay-contact-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="stay-card-label">
              STAY CONNECTED
            </p>

            <h3>Let's stay connected.</h3>

            <p className="stay-card-text">
              Have a question, want to make a booking, or simply want to
              stay updated with {siteSettings?.property_name || siteSettings?.propertyName || "BGRAND"}? Connect with us.
            </p>

            <div className="stay-links">

              <a
                href={siteSettings?.whatsapp_number ? `https://wa.me/${String(siteSettings.whatsapp_number).replace(/[^0-9]/g, "")}` : siteSettings?.contact_number ? `https://wa.me/${String(siteSettings.contact_number).replace(/[^0-9]/g, "")}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="stay-link-card"
              >
                <span className="stay-icon">◉</span>
                <div>
                  <strong>WhatsApp</strong>
                  <small>Booking & Enquiries</small>
                </div>
                <span className="stay-arrow">→</span>
              </a>

              <a
                href={siteSettings?.instagram_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="stay-link-card"
              >
                <span className="stay-icon">◎</span>
                <div>
                  <strong>Instagram</strong>
                  <small>{siteSettings?.instagram_url ? "Follow BGRAND" : "Instagram link not set"}</small>
                </div>
                <span className="stay-arrow">→</span>
              </a>

              <a
                href={siteSettings?.contact_number ? `tel:${siteSettings.contact_number}` : "#"}
                className="stay-link-card"
              >
                <span className="stay-icon">☎</span>
                <div>
                  <strong>Call Us</strong>
                  <small>{siteSettings?.contact_number || "Contact BGRAND"}</small>
                </div>
                <span className="stay-arrow">→</span>
              </a>

              <a
                href={siteSettings?.property_email ? `mailto:${siteSettings.property_email}` : "#"}
                className="stay-link-card"
              >
                <span className="stay-icon">@</span>
                <div>
                  <strong>Email</strong>
                  <small>{siteSettings?.property_email || "Email BGRAND"}</small>
                </div>
                <span className="stay-arrow">→</span>
              </a>

            </div>
          </motion.div>



        </div>

        <motion.div
          className="stay-closing"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span></span>
          <p>We look forward to welcoming you.</p>
          <span></span>
        </motion.div>

      </section>

      {/* ROOM DETAILS MODAL */}

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            className="room-modal"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeRoomDetails}
          >
            <motion.div
              className="room-modal-content"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="room-modal-close"
                onClick={closeRoomDetails}
              >
                ×
              </button>

              {/* IMAGE GALLERY */}

              <div className="room-modal-gallery">

                <img
                  src={
                    selectedRoom.images[
                      currentImage
                    ]
                  }
                  alt={selectedRoom.name}
                />

                <button
                  className="gallery-prev"
                  onClick={previousImage}
                >
                  ‹
                </button>

                <button
                  className="gallery-next"
                  onClick={nextImage}
                >
                  ›
                </button>

                <div className="gallery-dots">
                  {selectedRoom.images.map(
                    (_, index) => (
                      <button
                        key={index}
                        className={
                          index === currentImage
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setCurrentImage(index)
                        }
                      />
                    )
                  )}
                </div>

              </div>

              <div className="room-modal-info">

                <p>STAY WITH US</p>

                <h2>
                  {selectedRoom.name}
                </h2>

                <p>
                  {selectedRoom.description}
                </p>

                <div className="room-modal-features">
                  {selectedRoom.features.map(
                    (feature) => (
                      <span key={feature}>
                        {feature}
                      </span>
                    )
                  )}
                </div>

                <div className="room-modal-bottom">

                  <div>
                    <strong>
                      {siteSettings?.currency || "₹"}{Number(selectedRoom.price).toLocaleString("en-IN")}
                    </strong>

                    <span>/ night</span>
                  </div>

                  <motion.button
                    onClick={() =>
                      openBooking(
                        selectedRoom.name
                      )
                    }
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    Book This Room
                  </motion.button>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;