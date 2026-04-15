import { useState, useEffect } from "react"
import ListingCard from "./ListingCard"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [editingBio, setEditingBio] = useState(false)
  const [newBio, setNewBio] = useState("")
  const [loading, setLoading] = useState(true)
  const [bioError, setBioError] = useState("")

  const token = localStorage.getItem('token')
  const userId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    fetchProfile()
    fetchMyListings()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setUser(data)
      setNewBio(data.bio || "")
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchMyListings() {
    try {
      const res = await fetch(`http://localhost:3000/api/listings`)
      const data = await res.json()
      const mine = data.filter(l => l.sellerId == userId)
      setListings(mine)
    } catch (err) {
      console.error('Failed to load listings:', err)
    }
  }

  async function saveBio() {
    setBioError("")
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio: newBio })
      })

      if (!res.ok) {
        const err = await res.json()
        setBioError(err.error || 'Failed to save bio')
        return
      }

      setUser(prev => ({ ...prev, bio: newBio }))
      setEditingBio(false)
    } catch (err) {
      console.error('Failed to save bio:', err)
      setBioError('Something went wrong')
    }
  }

  async function deleteListing(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/listings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Delete failed:', err.error)
        return
      }

      setListings(prev => prev.filter(l => l.listingId !== id))
    } catch (err) {
      console.error('Failed to delete listing:', err)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0f28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }}>
      Loading...
    </div>
  )

  if (!userId) return (
    <div style={{ minHeight: '100vh', background: '#0a0f28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }}>
      You need to be logged in to view your profile.
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f28", color: "#fff", fontFamily: "'DM Mono', monospace" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Back button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: "transparent",
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            padding: "6px 14px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            cursor: "pointer",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to listings
        </button>

        {/* Avatar + info row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "28px", marginBottom: "40px" }}>

          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "linear-gradient(135deg, #F5A623, #E8831A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", fontWeight: "700", color: "#1a0e00", flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem", fontWeight: "700", color: "#fff", marginBottom: "8px",
            }}>
              {user?.email}
            </div>

            {editingBio ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                  rows={3}
                  placeholder="Write something about yourself..."
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(245,166,35,0.4)",
                    borderRadius: "8px", padding: "10px 12px", color: "#fff",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
                    resize: "none", outline: "none", width: "100%",
                  }}
                />
                {bioError && <p style={{ color: "#f87171", fontSize: "0.78rem", margin: 0 }}>{bioError}</p>}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveBio} style={{
                    background: "#F5A623", color: "#1a0e00", border: "none",
                    borderRadius: "6px", padding: "6px 16px",
                    fontFamily: "'DM Mono', monospace", fontWeight: "600",
                    fontSize: "0.78rem", cursor: "pointer",
                  }}>
                    Save
                  </button>
                  <button onClick={() => { setEditingBio(false); setBioError("") }} style={{
                    background: "transparent", color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px",
                    padding: "6px 16px", fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem", cursor: "pointer",
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "10px" }}>
                  {user?.bio || "No bio yet."}
                </p>
                <button onClick={() => setEditingBio(true)} style={{
                  background: "transparent", color: "#F5A623",
                  border: "1px solid rgba(245,166,35,0.35)", borderRadius: "6px",
                  padding: "5px 14px", fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem", cursor: "pointer",
                }}>
                  Edit bio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Listings section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem", fontWeight: "600", marginBottom: "20px", color: "#fff",
          }}>
            My Listings
          </div>

          {listings.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
              You don't have any listings yet.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {listings.map(listing => (
                <div key={listing.listingId} style={{ position: "relative" }}>
                  <ListingCard listing={listing} />
                  <button
                    onClick={() => deleteListing(listing.listingId)}
                    style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "rgba(200,80,80,0.85)", color: "#fff",
                      border: "none", borderRadius: "6px", padding: "4px 10px",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", cursor: "pointer",
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