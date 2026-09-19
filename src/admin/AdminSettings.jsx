import { useState } from "react";
import { motion } from "motion/react";
import "./AdminSettings.css";

function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const getSavedSettings = () => {
    try {
      return JSON.parse(localStorage.getItem("bgrandSettings")) || {};
    } catch {
      return {};
    }
  };

  const savedSettings = getSavedSettings();

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const settings = {
      propertyName: formData.get("propertyName"),
      propertyType: formData.get("propertyType"),
      propertyAddress: formData.get("propertyAddress"),
      contactNumber: formData.get("contactNumber"),
      propertyEmail: formData.get("propertyEmail"),
      administratorName: formData.get("administratorName"),
      adminEmail: formData.get("adminEmail"),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      checkInTime: formData.get("checkInTime"),
      checkOutTime: formData.get("checkOutTime"),
      maximumGuests: formData.get("maximumGuests"),
      currency: formData.get("currency"),
    };

    localStorage.setItem("bgrandSettings", JSON.stringify(settings));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="admin-settings-page">

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

          <a href="/admin/guests">
            <span>♙</span>
            Guests
          </a>

          <a href="/admin/settings" className="active">
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
          className="settings-title-section"
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
              ease: "easeOut",
            }}
          >
            SETTINGS
          </motion.h1>

          <motion.div
            className="settings-title-line"
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
            Property Settings
          </motion.span>

        </motion.section>

        <motion.form
          className="settings-content"
          onSubmit={handleSave}
          initial={{
            opacity: 0,
            y: 50,
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

          <motion.section
            className="settings-panel"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >

            <div className="settings-panel-heading">
              <div>
                <p>PROPERTY</p>
                <h2>Property Information</h2>
              </div>
            </div>

            <div className="settings-grid">

              <div className="settings-field">
                <label>Property Name</label>
                <input
                  type="text"
                  name="propertyName"
                  defaultValue={savedSettings.propertyName || "BGRAND"}
                />
              </div>

              <div className="settings-field">
                <label>Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  defaultValue={
                    savedSettings.propertyType || "Luxury Homestay"
                  }
                />
              </div>

              <div className="settings-field settings-full">
                <label>Property Address</label>
                <input
                  type="text"
                  name="propertyAddress"
                  defaultValue={
                    savedSettings.propertyAddress ||
                    "BGRAND, Andhra Pradesh, India"
                  }
                />
              </div>

              <div className="settings-field">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  defaultValue={
                    savedSettings.contactNumber || "+91 0000000000"
                  }
                />
              </div>

              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="propertyEmail"
                  defaultValue={
                    savedSettings.propertyEmail || "admin@bgrand.com"
                  }
                />
              </div>

            </div>

          </motion.section>

          <motion.section
            className="settings-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >

            <div className="settings-panel-heading">
              <div>
                <p>ADMINISTRATION</p>
                <h2>Admin Account</h2>
              </div>
            </div>

            <div className="settings-grid">

              <div className="settings-field">
                <label>Administrator Name</label>
                <input
                  type="text"
                  name="administratorName"
                  defaultValue={
                    savedSettings.administratorName || "Administrator"
                  }
                />
              </div>

              <div className="settings-field">
                <label>Admin Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  defaultValue={
                    savedSettings.adminEmail || "admin@bgrand.com"
                  }
                />
              </div>

              <div className="settings-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  defaultValue={savedSettings.currentPassword || ""}
                />
              </div>

              <div className="settings-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  defaultValue={savedSettings.newPassword || ""}
                />
              </div>

            </div>

          </motion.section>

          <motion.section
            className="settings-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >

            <div className="settings-panel-heading">
              <div>
                <p>BOOKING</p>
                <h2>Booking Settings</h2>
              </div>
            </div>

            <div className="settings-grid">

              <div className="settings-field">
                <label>Check-in Time</label>
                <input
                  type="time"
                  name="checkInTime"
                  defaultValue={savedSettings.checkInTime || "14:00"}
                />
              </div>

              <div className="settings-field">
                <label>Check-out Time</label>
                <input
                  type="time"
                  name="checkOutTime"
                  defaultValue={savedSettings.checkOutTime || "11:00"}
                />
              </div>

              <div className="settings-field">
                <label>Maximum Guests</label>
                <select
                  name="maximumGuests"
                  defaultValue={savedSettings.maximumGuests || "5"}
                >
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="10">10 Guests</option>
                </select>
              </div>

              <div className="settings-field">
                <label>Currency</label>
                <select
                  name="currency"
                  defaultValue={savedSettings.currency || "INR"}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

            </div>

          </motion.section>

          <motion.div
            className="settings-save-area"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.15,
            }}
          >

            <motion.button
              type="submit"
              className="settings-save-btn"
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              {saved ? "✓ Settings Saved" : "Save Settings"}
            </motion.button>

          </motion.div>

        </motion.form>

      </main>

    </div>
  );
}

export default AdminSettings;
