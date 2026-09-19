import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./AdminGallery.css";

function AdminGallery() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [galleryImages, setGalleryImages] = useState([
    {
      title: "Property View",
      image: "/bgrand-gallery-1.jpg",
    },
    {
      title: "Room Interior",
      image: "/bgrand-gallery-2.jpg",
    },
    {
      title: "Resort View",
      image: "/bgrand-gallery-3.jpg",
    },
    {
      title: "Bedroom",
      image: "/bgrand-gallery-4.jpg",
    },
    {
      title: "BGRAND Accommodation",
      image: "/bgrand-gallery-5.jpg",
    },
  ]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleAddImage = (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    if (!imageTitle.trim()) {
      alert("Please enter an image title.");
      return;
    }

    const newImage = {
      title: imageTitle.trim(),
      image: selectedImage.preview,
    };

    setGalleryImages((prev) => [...prev, newImage]);

    setImageTitle("");
    setSelectedImage(null);
    setShowAddModal(false);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;

    setGalleryImages((prev) =>
      prev.filter((_, index) => index !== deleteIndex)
    );

    setDeleteIndex(null);
  };

  return (
    <div className="admin-gallery-page">

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

          <a href="/admin/gallery" className="active">
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

        {/* CENTER GALLERY HEADING */}

        <motion.section
          className="gallery-title-section"
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
            GALLERY
          </motion.h1>

          <motion.div
            className="gallery-title-line"
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
            Property Gallery
          </motion.span>

        </motion.section>

        {/* GALLERY CONTENT */}

        <motion.section
          className="gallery-main-content"
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

          <div className="gallery-welcome">

            <p>PROPERTY GALLERY</p>

            <h2>
              Manage BGRAND Images
            </h2>

            <span>
              Manage your resort photos and property images.
            </span>

          </div>

          <div className="gallery-actions">

            <motion.button
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => setShowAddModal(true)}
            >
              <span>+</span>
              Add Gallery Image
            </motion.button>

          </div>

          <section className="gallery-grid">

            {galleryImages.map((item, index) => (

              <motion.div
                className="gallery-card"
                key={`${item.title}-${index}`}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + index * 0.08,
                }}
                whileHover={{
                  y: -6,
                }}
              >

                <div className="gallery-image-wrapper">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="gallery-image-overlay">
                    <span>BGRAND</span>
                  </div>

                </div>

                <div className="gallery-card-info">

                  <h3>
                    {item.title}
                  </h3>

                  <motion.button
                    className="gallery-delete-btn"
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() => setDeleteIndex(index)}
                  >
                    Delete
                  </motion.button>

                </div>

              </motion.div>

            ))}

          </section>

        </motion.section>

      </main>

      {/* ADD IMAGE MODAL */}

      <AnimatePresence>

        {showAddModal && (

          <motion.div
            className="gallery-modal"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setShowAddModal(false)}
          >

            <motion.div
              className="gallery-modal-box"
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
              exit={{
                opacity: 0,
                scale: 0.75,
                y: 40,
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="gallery-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>

              <p className="gallery-modal-label">
                BGRAND GALLERY
              </p>

              <h2>
                Add Gallery Image
              </h2>

              <form onSubmit={handleAddImage}>

                <label>
                  Image Title
                </label>

                <input
                  type="text"
                  placeholder="Enter image title"
                  value={imageTitle}
                  onChange={(e) =>
                    setImageTitle(e.target.value)
                  }
                />

                <label>
                  Select Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />

                {selectedImage && (
                  <div className="gallery-preview">
                    <img
                      src={selectedImage.preview}
                      alt="Preview"
                    />
                  </div>
                )}

                <div className="gallery-modal-actions">

                  <button
                    type="button"
                    className="gallery-cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedImage(null);
                      setImageTitle("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="gallery-add-btn"
                  >
                    Add Image
                  </button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* DELETE CONFIRMATION */}

      <AnimatePresence>

        {deleteIndex !== null && (

          <motion.div
            className="gallery-modal"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setDeleteIndex(null)}
          >

            <motion.div
              className="gallery-delete-modal"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <div className="delete-icon">
                !
              </div>

              <h2>
                Delete Image?
              </h2>

              <p>
                Are you sure you want to remove this image
                from the gallery?
              </p>

              <div className="delete-actions">

                <button
                  className="delete-cancel-btn"
                  onClick={() => setDeleteIndex(null)}
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-btn"
                  onClick={confirmDelete}
                >
                  Delete
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

export default AdminGallery;