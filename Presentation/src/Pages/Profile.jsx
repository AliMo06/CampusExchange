import { useState } from "react"
import ListingCard from "./ListingCard"

// mock data for now - will be replaced with real API calls later
const mockUser = {
  username: "senan",
  bio: "Selling some stuff I don't need anymore. U of M student.",
  profilePic: null,
}

const mockListings = [
  {
    listing_id: 1,
    title: "Calculus Textbook",
    description: "Used for one semester, barely touched.",
    price: 40,
    condition: "like_new",
    category: "Textbooks",
    imageUrl: null,
  },
  {
    listing_id: 2,
    title: "Desk Lamp",
    description: "Works perfectly, just don't need it anymore.",
    price: 15,
    condition: "good",
    category: "Furniture",
    imageUrl: null,
  },
  {
    listing_id: 3,
    title: "Mechanical Keyboard",
    description: "Blue switches, great condition.",
    price: 60,
    condition: "good",
    category: "Electronics",
    imageUrl: null,
  },
]

export default function Profile() {
  const [user, setUser] = useState(mockUser)
  const [listings, setListings] = useState(mockListings)
  const [editingBio, setEditingBio] = useState(false)
  const [newBio, setNewBio] = useState(user.bio)
  const [avatarError, setAvatarError] = useState(false)

  function saveBio() {
    setUser(prev => ({ ...prev, bio: newBio }))
    setEditingBio(false)
  }

  function deleteListing(id) {
    setListings(prev => prev.filter(l => l.listing_id !== id))
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f28",
      color: "#fff",
      fontFamily: "'DM Mono', monospace",
    }}>

      {/* Profile header */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 24px 40px",
      }}>

        {/* Avatar + info row */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "28px",
          marginBottom: "40px",
        }}>

          {/* Avatar */}
          {user.profilePic && !avatarError ? (
            <img
              src={user.profilePic}
              alt={user.username}
              onError={() => setAvatarError(true)}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(245,166,35,0.5)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F5A623, #E8831A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1a0e00",
              flexShrink: 0,
            }}>
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {/* Username + bio */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "8px",
            }}>
              {user.username}
            </div>

            {editingBio ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                  rows={3}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(245,166,35,0.4)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#fff",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    resize: "none",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={saveBio}
                    style={{
                      background: "#F5A623",
                      color: "#1a0e00",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 16px",
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: "600",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBio(false)}
                    style={{
                      background: "transparent",
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      padding: "6px 16px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.88rem",
                  lineHeight: "1.6",
                  marginBottom: "10px",
                }}>
                  {user.bio || "No bio yet."}
                </p>
                <button
                  onClick={() => setEditingBio(true)}
                  style={{
                    background: "transparent",
                    color: "#F5A623",
                    border: "1px solid rgba(245,166,35,0.35)",
                    borderRadius: "6px",
                    padding: "5px 14px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Edit bio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Listings section */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "32px",
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#fff",
          }}>
            My Listings
          </div>

          {listings.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
              You don't have any listings yet.
            </p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}>
              {listings.map(listing => (
                <div key={listing.listing_id} style={{ position: "relative" }}>
                  <ListingCard listing={listing} />
                  <button
                    onClick={() => deleteListing(listing.listing_id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(200,80,80,0.85)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}