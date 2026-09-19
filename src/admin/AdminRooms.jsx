import { useEffect, useState } from "react";
import "./AdminRooms.css";
import { supabase } from "../lib/supabase";

function AdminRooms() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomImage, setRoomImage] = useState("/bgrand-gallery-1.jpg");
  const [roomStatus, setRoomStatus] = useState("Available");
  const [roomFeatures, setRoomFeatures] = useState("");
  const [roomExtraImages, setRoomExtraImages] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching rooms:", error);
      alert("Unable to load rooms.");
      setLoading(false);
      return;
    }

    setRooms(data || []);
    setLoading(false);
  };

  const getImage = (room, index) => {
    if (room.image) {
      return room.image;
    }

    const fallbackImages = [
      "/bgrand-gallery-1.jpg",
      "/bgrand-gallery-2.jpg",
      "/bgrand-gallery-3.jpg",
    ];

    return fallbackImages[index] || "/bgrand-gallery-4.jpg";
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomName || !roomPrice || !roomDescription) {
      alert("Please fill all required fields.");
      return;
    }

    const newRoom = {
      name: roomName,
      description: roomDescription,
      price: Number(roomPrice),
      image: roomImage,
      features: roomFeatures
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      extra_images: roomExtraImages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      available: roomStatus === "Available",
    };

    const { error } = await supabase
      .from("rooms")
      .insert(newRoom);

    if (error) {
      console.error("Error adding room:", error);
      alert("Room could not be added.");
      return;
    }

    await fetchRooms();

    setRoomName("");
    setRoomPrice("");
    setRoomDescription("");
    setRoomImage("/bgrand-gallery-1.jpg");
    setRoomStatus("Available");
    setRoomFeatures("");
    setRoomExtraImages("");
    setShowForm(false);

    alert("Room added successfully.");
  };
const handleEdit = (room) => {
  setEditRoom({
    ...room,
    price: room.price ?? "",
    status: room.available ? "Available" : "Unavailable",
    featuresText: Array.isArray(room.features) ? room.features.join(", ") : "",
    extraImagesText: Array.isArray(room.extra_images) ? room.extra_images.join(", ") : "",
  });
};

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editRoom.name || !editRoom.price || !editRoom.description) {
      alert("Please fill all required fields.");
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .update({
        name: editRoom.name,
        description: editRoom.description,
        price: Number(editRoom.price),
        image: editRoom.image,
        features: (editRoom.featuresText || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        extra_images: (editRoom.extraImagesText || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        available: editRoom.status === "Available",
      })
      .eq("id", editRoom.id);

    if (error) {
      console.error("Error updating room:", error);
      alert("Room could not be updated.");
      return;
    }

    await fetchRooms();

    setEditRoom(null);

    alert("Room updated successfully.");
  };

  const handleDeleteRoom = async (room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${room.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", room.id);

    if (error) {
      console.error("Error deleting room:", error);
      alert("Room could not be deleted.");
      return;
    }

    setRooms((currentRooms) =>
      currentRooms.filter((item) => item.id !== room.id)
    );

    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
    }

    alert("Room deleted successfully.");
  };

  const handleManage = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="admin-rooms-page">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          BGRAND<span>ADMIN</span>
        </div>

        <nav className="admin-nav">

          <a href="/admin/dashboard">
            <span>▦</span>
            Dashboard
          </a>

          <a href="/admin/rooms" className="active">
            <span>▣</span>
            Rooms
          </a>

          <a href="/admin/bookings">
            <span>▤</span>
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

        <div className="rooms-page-header">

          <div>
            <p>ROOM MANAGEMENT</p>

            <h1>Rooms</h1>

            <span>
              Manage BGRAND rooms and accommodation details.
            </span>
          </div>

          <button
            className="add-room-btn"
            onClick={() => setShowForm(true)}
          >
            + Add New Room
          </button>

        </div>

        <div className="admin-rooms-grid">

          {loading ? (
            <p>Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p>No rooms found.</p>
          ) : (
            rooms.map((room, index) => (

              <div
                className="admin-room-card"
                key={room.id}
              >

                <div className="admin-room-image">

                  <img
                    src={getImage(room, index)}
                    alt={room.name}
                  />

                </div>

                <div className="room-card-top">

                  <span className="room-status">
                    {room.available ? "Available" : "Unavailable"}
                  </span>

                </div>

                <h2>{room.name}</h2>

                <p className="admin-room-description">
                  {room.description}
                </p>

                <div className="admin-room-price">

                  <strong>
                    ₹{Number(room.price).toLocaleString("en-IN")}
                  </strong>

                  <span>/ night</span>

                </div>

                <div className="admin-room-actions">

                  <button
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleManage(room)}
                  >
                    Manage
                  </button>

                  <button
                    onClick={() => handleDeleteRoom(room)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

        {showForm && (

          <div className="admin-room-modal">

            <div className="room-form-box">

              <h2>Add Room Details</h2>

              <form onSubmit={handleAddRoom}>

                <label>Room Name</label>

                <input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) =>
                    setRoomName(e.target.value)
                  }
                  required
                />

                <label>Price Per Night</label>

                <input
                  type="number"
                  placeholder="Enter room price"
                  value={roomPrice}
                  onChange={(e) =>
                    setRoomPrice(e.target.value)
                  }
                  required
                />

                <label>Room Description</label>

                <textarea
                  placeholder="Enter room description"
                  value={roomDescription}
                  onChange={(e) =>
                    setRoomDescription(e.target.value)
                  }
                  required
                />

                <label>Room Features</label>

                <input
                  type="text"
                  placeholder="King Bed, Free Wi-Fi, Air Conditioning"
                  value={roomFeatures}
                  onChange={(e) => setRoomFeatures(e.target.value)}
                />

                <label>Extra Room Images (comma separated URLs)</label>

                <input
                  type="text"
                  placeholder="Image URL 1, Image URL 2"
                  value={roomExtraImages}
                  onChange={(e) => setRoomExtraImages(e.target.value)}
                />

                <label>Room Image</label>

                <select
                  value={roomImage}
                  onChange={(e) =>
                    setRoomImage(e.target.value)
                  }
                >
                  <option value="/bgrand-gallery-1.jpg">
                    BGRAND Image 1
                  </option>

                  <option value="/bgrand-gallery-2.jpg">
                    BGRAND Image 2
                  </option>

                  <option value="/bgrand-gallery-3.jpg">
                    BGRAND Image 3
                  </option>

                  <option value="/bgrand-gallery-4.jpg">
                    BGRAND Image 4
                  </option>

                  <option value="/bgrand-gallery-5.jpg">
                    BGRAND Image 5
                  </option>
                </select>

                <label>Room Status</label>

                <select
                  value={roomStatus}
                  onChange={(e) =>
                    setRoomStatus(e.target.value)
                  }
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>
                </select>

                <div className="room-form-buttons">

                  <button type="submit">
                    Add Room
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {editRoom && (

          <div className="admin-room-modal">

            <div className="room-form-box">

              <h2>Edit Room Details</h2>

              <form onSubmit={handleSaveEdit}>

                <label>Room Name</label>

                <input
                  type="text"
                  value={editRoom.name}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <label>Price Per Night</label>

                <input
                  type="number"
                  value={editRoom.price}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      price: e.target.value,
                    })
                  }
                  required
                />

                <label>Room Description</label>

                <textarea
                  value={editRoom.description}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <label>Room Features</label>

                <input
                  type="text"
                  placeholder="King Bed, Free Wi-Fi, Air Conditioning"
                  value={editRoom.featuresText || ""}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      featuresText: e.target.value,
                    })
                  }
                />

                <label>Extra Room Images (comma separated URLs)</label>

                <input
                  type="text"
                  placeholder="Image URL 1, Image URL 2"
                  value={editRoom.extraImagesText || ""}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      extraImagesText: e.target.value,
                    })
                  }
                />

                <label>Room Image</label>

                <select
                  value={editRoom.image || "/bgrand-gallery-1.jpg"}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      image: e.target.value,
                    })
                  }
                >
                  <option value="/bgrand-gallery-1.jpg">
                    BGRAND Image 1
                  </option>

                  <option value="/bgrand-gallery-2.jpg">
                    BGRAND Image 2
                  </option>

                  <option value="/bgrand-gallery-3.jpg">
                    BGRAND Image 3
                  </option>

                  <option value="/bgrand-gallery-4.jpg">
                    BGRAND Image 4
                  </option>

                  <option value="/bgrand-gallery-5.jpg">
                    BGRAND Image 5
                  </option>
                </select>

                <label>Room Status</label>

                <select
                  value={editRoom.status || "Available"}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>
                </select>

                <div className="room-form-buttons">

                  <button type="submit">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRoom(null)}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {selectedRoom && (

          <div className="admin-room-modal">

            <div className="room-manage-box">

              <button
                className="manage-close"
                onClick={() => setSelectedRoom(null)}
              >
                ×
              </button>

              <img
                src={
                  selectedRoom.image ||
                  "/bgrand-gallery-1.jpg"
                }
                alt={selectedRoom.name}
              />

              <p>ROOM MANAGEMENT</p>

              <h2>{selectedRoom.name}</h2>

              <div className="manage-details">

                <span>
                  Price

                  <strong>
                    ₹
                    {Number(
                      selectedRoom.price
                    ).toLocaleString("en-IN")}
                  </strong>
                </span>

                <span>
                  Status

                  <strong>
                    {selectedRoom.available
                      ? "Available"
                      : "Unavailable"}
                  </strong>
                </span>

              </div>

              <p>
                {selectedRoom.description}
              </p>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminRooms;