import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import "./AdminSettings.css";

const DEFAULT_SETTINGS = {
  id: 1,
  propertyName: "BGRAND",
  propertyType: "Luxury Homestay",
  propertyAddress: "BGRAND, Andhra Pradesh, India",
  contactNumber: "+91 0000000000",
  propertyEmail: "admin@bgrand.com",
  whatsappNumber: "+91 0000000000",
  instagramUrl: "",
  administratorName: "Administrator",
  adminEmail: "admin@bgrand.com",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  maximumGuests: "5",
  currency: "INR",
};

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("bgrand-settings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setSettings((current) => ({
              ...current,
              ...mapSettings(payload.new),
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log("Settings Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const mapSettings = (data) => ({
    id: data.id || 1,
    propertyName: data.property_name ?? DEFAULT_SETTINGS.propertyName,
    propertyType: data.property_type ?? DEFAULT_SETTINGS.propertyType,
    propertyAddress: data.property_address ?? DEFAULT_SETTINGS.propertyAddress,
    contactNumber: data.contact_number ?? DEFAULT_SETTINGS.contactNumber,
    propertyEmail: data.property_email ?? DEFAULT_SETTINGS.propertyEmail,
    whatsappNumber: data.whatsapp_number ?? DEFAULT_SETTINGS.whatsappNumber,
    instagramUrl: data.instagram_url ?? DEFAULT_SETTINGS.instagramUrl,
    administratorName:
      data.administrator_name ?? DEFAULT_SETTINGS.administratorName,
    adminEmail: data.admin_email ?? DEFAULT_SETTINGS.adminEmail,
    checkInTime: data.check_in_time ?? DEFAULT_SETTINGS.checkInTime,
    checkOutTime: data.check_out_time ?? DEFAULT_SETTINGS.checkOutTime,
    maximumGuests: String(
      data.maximum_guests ?? DEFAULT_SETTINGS.maximumGuests
    ),
    currency: data.currency ?? DEFAULT_SETTINGS.currency,
  });

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Settings fetch error:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setSettings(mapSettings(data));
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("settings").upsert(
      {
        id: 1,
        property_name: settings.propertyName,
        property_type: settings.propertyType,
        property_address: settings.propertyAddress,
        contact_number: settings.contactNumber,
        property_email: settings.propertyEmail,
        whatsapp_number: settings.whatsappNumber,
        instagram_url: settings.instagramUrl,
        administrator_name: settings.administratorName,
        admin_email: settings.adminEmail,
        check_in_time: settings.checkInTime,
        check_out_time: settings.checkOutTime,
        maximum_guests: Number(settings.maximumGuests),
        currency: settings.currency,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Settings save error:", error);
      alert("Failed to save settings. Check Supabase policies.");
      return;
    }

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
          initial={{ opacity: 0, scale: 0.75, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "8px" }}
            animate={{ opacity: 1, letterSpacing: "4px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            BGRAND
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25, letterSpacing: "18px" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "7px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            SETTINGS
          </motion.h1>

          <motion.div
            className="settings-title-line"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 90, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Property Settings
          </motion.span>
        </motion.section>

        <motion.form
          className="settings-content"
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
                  value={settings.propertyName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  value={settings.propertyType}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field settings-full">
                <label>Property Address</label>
                <input
                  type="text"
                  name="propertyAddress"
                  value={settings.propertyAddress}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={settings.contactNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="propertyEmail"
                  value={settings.propertyEmail}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="settings-field">
                <label>Instagram URL</label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="https://instagram.com/yourpage"
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
                  value={settings.administratorName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Admin Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Password authentication is separate"
                  disabled
                />
              </div>

              <div className="settings-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Password authentication is separate"
                  disabled
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
                  value={settings.checkInTime}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Check-out Time</label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={settings.checkOutTime}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="settings-field">
                <label>Maximum Guests</label>
                <select
                  name="maximumGuests"
                  value={settings.maximumGuests}
                  onChange={handleChange}
                  disabled={loading}
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
                  value={settings.currency}
                  onChange={handleChange}
                  disabled={loading}
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
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
          >
            <motion.button
              type="submit"
              className="settings-save-btn"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
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
