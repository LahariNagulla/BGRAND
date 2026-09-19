import { useState } from "react";
import "./AdminRooms.css";

function AdminRooms() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);

  const [rooms, setRooms] = useState([
    {
      name: "Luxury Deluxe Room",
      price: "₹2,999",
      status: "Available",
      image: "/bgrand-gallery-1.jpg",
      description:
        "A comfortable and elegant room for a relaxing stay.",
      features: ["King Bed", "Free Wi-Fi", "Air Conditioning"],
    },
    {
      name: "Premium Suite",
      price: "₹4,499",
      status: "Available",
      image: "/bgrand-gallery-2.jpg",
      description:
        "A spacious premium suite designed for extra comfort.",
      features: ["King Bed", "Private Lounge", "Free Wi-Fi"],
    },
    {
      name: "Executive Room",
      price: "₹3,499",
      status: "Available",
      image: "/bgrand-gallery-3.jpg",
      description:
        "A modern room combining comfort and convenience.",
      features: ["Queen Bed", "Smart TV", "Air Conditioning"],
    },
  ]);

  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomImage, setRoomImage] = useState(
    "/bgrand-gallery-4.jpg"
  );
  const [roomStatus, setRoomStatus] = useState("Available");
  const [roomFeatures, setRoomFeatures] = useState("");

  const handleAddRoom = (e) => {
    e.preventDefault();

    if (!roomName || !roomPrice || !roomDescription) {
      return;
    }

    const newRoom = {
      name: roomName,
      price: `₹${roomPrice}`,
      status: roomStatus,
      image: roomImage,
      description: roomDescription,
      features: roomFeatures
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    setRooms([...rooms, newRoom]);

    setRoomName("");
    setRoomPrice("");
    setRoomDescription("");
    setRoomImage("/bgrand-gallery-4.jpg");
    setRoomStatus("Available");
    setRoomFeatures("");
    setShowForm(false);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleEdit = (room) => {
    setEditRoom({
      ...room,
      originalName: room.name,
      price: room.price.replace("₹", ""),
      features: room.features || [],
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    setRooms(
      rooms.map((room) =>
        room.name === editRoom.originalName
          ? {
              ...room,
              name: editRoom.name,
              price: `₹${editRoom.price}`,
              status: editRoom.status,
              image: editRoom.image,
              description: editRoom.description,
              features: editRoom.features,
            }
          : room
      )
    );

    setEditRoom(null);
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

        {rooms.map((room) => (
          <div
            className="admin-room-card"
            key={room.name}
          >

            <div className="admin-room-image">
              <img
                src={room.image}
                alt={room.name}
              />
            </div>

            <div className="room-card-top">
              <span className="room-status">
                {room.status}
              </span>
            </div>

            <h2>{room.name}</h2>

            <p className="admin-room-description">
              {room.description}
            </p>

            <div className="admin-room-price">
              <strong>{room.price}</strong>

              <span>/ night</span>
            </div>

            {room.features &&
              room.features.length > 0 && (
                <div className="admin-room-features">

                  {room.features.map((feature) => (
                    <span key={feature}>
                      {feature}
                    </span>
                  ))}

                </div>
              )}

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

            </div>

          </div>
        ))}

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

              <label>Room Features</label>

              <input
                type="text"
                placeholder="King Bed, Free Wi-Fi, AC"
                value={roomFeatures}
                onChange={(e) =>
                  setRoomFeatures(e.target.value)
                }
              />

              <small>
                Separate features with commas.
              </small>

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

              <label>Room Image</label>

              <select
                value={editRoom.image}
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
                value={editRoom.status}
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

              <label>Room Features</label>

              <input
                type="text"
                value={editRoom.features.join(", ")}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom,
                    features: e.target.value
                      .split(",")
                      .map((feature) => feature.trim())
                      .filter(Boolean),
                  })
                }
              />

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
              src={selectedRoom.image}
              alt={selectedRoom.name}
            />

            <p>ROOM MANAGEMENT</p>

            <h2>{selectedRoom.name}</h2>

            <div className="manage-details">

              <span>
                Price

                <strong>
                  {selectedRoom.price}
                </strong>
              </span>

              <span>
                Status

                <strong>
                  {selectedRoom.status}
                </strong>
              </span>

            </div>

            <p>
              {selectedRoom.description}
            </p>

            {selectedRoom.features &&
              selectedRoom.features.length > 0 && (
                <div className="manage-features">

                  {selectedRoom.features.map(
                    (feature) => (
                      <span key={feature}>
                        {feature}
                      </span>
                    )
                  )}

                </div>
              )}

          </div>

        </div>
      )}

      </main>
    </div>
  );
}

export default AdminRooms;