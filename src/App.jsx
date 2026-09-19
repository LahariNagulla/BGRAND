import { useState } from "react";
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

  const rooms = [
    {
      name: "Luxury Deluxe Room",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85",
      ],
      description:
        "A beautifully designed room offering a comfortable and relaxing stay.",
      price: "₹2,999",
      features: [
        "King Bed",
        "Free Wi-Fi",
        "Air Conditioning",
      ],
    },
    {
      name: "Premium Suite",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85",
      ],
      description:
        "A spacious premium suite designed for guests looking for extra comfort.",
      price: "₹4,499",
      features: [
        "King Bed",
        "Private Lounge",
        "Free Wi-Fi",
      ],
    },
    {
      name: "Executive Room",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
      ],
      description:
        "An elegant stay experience combining modern interiors with everyday comfort.",
      price: "₹3,499",
      features: [
        "Queen Bed",
        "Smart TV",
        "Air Conditioning",
      ],
    },
  ];

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

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const room = formData.get("room");
    const checkIn = formData.get("checkIn");
    const checkOut = formData.get("checkOut");
    const guests = formData.get("guests");

    const booking = {
      id: `BG${Date.now()}`,
      name,
      phone,
      room,
      checkIn,
      checkOut,
      guests,
      status: "Pending",
    };

    const existingBookings =
      JSON.parse(localStorage.getItem("bgrandBookings")) || [];

    localStorage.setItem(
      "bgrandBookings",
      JSON.stringify([...existingBookings, booking])
    );

    const message = `Hello BGRAND,

I would like to make a booking.

Room: ${room || "Not selected"}
Name: ${name}
Phone: ${phone}
Check-in: ${checkIn}
Check-out: ${checkOut}
Guests: ${guests}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

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
          alt="BGRAND Homestay"
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
                    <strong>{room.price}</strong>
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

          <motion.div
            className="gallery-item gallery-large"
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
            }}
          >
            <img
              src="/bgrand-gallery-1.jpg"
              alt="BGRAND room"
            />

            <div className="gallery-overlay">
              <span>ROOMS</span>
              <strong>Comfortable Stay</strong>
            </div>
          </motion.div>

          <motion.div
            className="gallery-item"
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
              delay: 0.1,
            }}
          >
            <img
              src="/bgrand-gallery-2.jpg"
              alt="BGRAND room interior"
            />

            <div className="gallery-overlay">
              <span>INTERIOR</span>
              <strong>Relax & Unwind</strong>
            </div>
          </motion.div>

          <motion.div
            className="gallery-item"
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
              delay: 0.2,
            }}
          >
            <img
              src="/bgrand-gallery-3.jpg"
              alt="BGRAND bedroom"
            />

            <div className="gallery-overlay">
              <span>BEDROOM</span>
              <strong>Peaceful Nights</strong>
            </div>
          </motion.div>

          <motion.div
            className="gallery-item"
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
              delay: 0.3,
            }}
          >
            <img
              src="/bgrand-gallery-4.jpg"
              alt="BGRAND living area"
            />

            <div className="gallery-overlay">
              <span>LIVING SPACE</span>
              <strong>Feel at Home</strong>
            </div>
          </motion.div>

          <motion.div
            className="gallery-item gallery-wide"
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
              delay: 0.4,
            }}
          >
            <img
              src="/bgrand-gallery-5.jpg"
              alt="BGRAND accommodation"
            />

            <div className="gallery-overlay">
              <span>BGRAND</span>
              <strong>Your Comfortable Escape</strong>
            </div>
          </motion.div>

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
            ABOUT BGRAND
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
                Find BGRAND easily and get directions to your stay.
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
            <option value="">
              Number of Guests
            </option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5+">5+ Guests</option>
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
            Thank You for Choosing <span>BGRAND</span>
          </h2>

          <div className="stay-line"></div>

          <p className="stay-message">
            Thank you for choosing BGRAND. We look forward to welcoming you
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
              stay updated with BGRAND? Connect with us.
            </p>

            <div className="stay-links">

              <a
                href="https://wa.me/"
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
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="stay-link-card"
              >
                <span className="stay-icon">◎</span>
                <div>
                  <strong>Instagram</strong>
                  <small>Follow BGRAND</small>
                </div>
                <span className="stay-arrow">→</span>
              </a>

              <a
                href="tel:+910000000000"
                className="stay-link-card"
              >
                <span className="stay-icon">☎</span>
                <div>
                  <strong>Call Us</strong>
                  <small>Contact BGRAND</small>
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
                      {selectedRoom.price}
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