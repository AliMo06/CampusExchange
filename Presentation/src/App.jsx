import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import Profile from "./Pages/Profile"
import Navbar from './Pages/Navbar'
import ListingCard from './Pages/ListingCard'

// ─── Google Fonts loader ──────────────────────────────────────────────────────
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500;600&display=swap'

function loadFonts() {
  if (!document.getElementById('ce-fonts')) {
    const link = document.createElement('link')
    link.id = 'ce-fonts'
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    document.head.appendChild(link)
  }
}

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Appliances', 'Lab Supplies', 'Misc']

function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null) // Make sure to populate this when the user logs in
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [mounted, setMounted] = useState(false)
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'new',
    category_id: 1 // Defaulting to 1, assuming category IDs map to integers
  })

  useEffect(() => {
    loadFonts()
    setMounted(true)
    fetchListings()
  }, [])

  // Pull active listings from your PostgreSQL database
  const fetchListings = async () => {
    try {
      setLoading(true)
      // Hits the GET '/' route to get all active listings 
      const res = await fetch('/api/listings') 
      const data = await res.json()
      setListings(data)
    } catch (err) {
      console.error('Failed to load listings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter listings locally (You also have a backend route for this if you prefer server-side filtering!)
  const filtered = listings.filter(l => {
    const matchSearch = search.trim() === '' ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
    
    // Fallback logic in case DB categories are numbers or strings
    const catName = CATEGORIES[l.categoryId] || l.categoryId // adjust based on DB schema
    const matchCat = activeCategory === 'All' || catName === activeCategory
    
    return matchSearch && matchCat
  })

  const handleLogin = () => navigate('/login')
  const handleSignup = () => navigate('/signup')

  const submitNewListing = async (e) => {
    e.preventDefault()
    
    try {
      // Hits the POST '/' route 
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user.token}` // IMPORTANT: requireAuth middleware needs this 
        },
        body: JSON.stringify({
          seller_id: user ? user.user_id : 1, // Assumes user state has ID
          category_id: parseInt(newListing.category_id),
          title: newListing.title,
          description: newListing.description,
          price: parseFloat(newListing.price),
          condition: newListing.condition
          // status defaults to "active" in your backend factory [cite: 2, 3]
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create listing')
      }

      const createdListing = await res.json()
      
      // Add the new listing to the UI immediately
      setListings(prev => [createdListing, ...prev])
      
      // Close modal and reset form
      setShowCreateModal(false)
      setNewListing({ title: '', description: '', price: '', condition: 'new', category_id: 1 })
      
    } catch (err) {
      console.error(err)
      alert('Error creating listing.')
    }
  }

  const handleCardClick = (listing) => {
    alert(`Open listing: ${listing.title}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c1e',
      color: '#fff',
      fontFamily: "'DM Mono', monospace",
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-15%', width: '500px', height: '500px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,120,245,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar
          user={user}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onCreateListing={() => setShowCreateModal(true)}
        />

        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>

          {/* Hero heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: '800', color: '#fff', lineHeight: '1.15', letterSpacing: '-0.02em', margin: '0 0 0.6rem',
            }}>
              Buy, sell & swap<br />
              <span style={{ color: '#F5A623' }}>on campus.</span>
            </h1>
            <p style={{
              fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.4)', margin: 0,
            }}>
              Everything your campus community is offering right now.
            </p>
          </div>

          {/* Search + filter bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.2rem' }}>
            <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.35, fontSize: '0.9rem' }}>🔍</span>
              <input
                type="text" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', fontFamily: "'DM Mono', monospace",
                  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat ? 'rgba(245,166,35,0.18)' : 'rgba(255,255,255,0.05)',
                    color: activeCategory === cat ? '#F5A623' : 'rgba(255,255,255,0.5)',
                    border: activeCategory === cat ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '0.35rem 0.9rem', fontFamily: "'DM Mono', monospace",
                    fontSize: '0.72rem', fontWeight: '500', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', marginBottom: '1.2rem' }}>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Listings grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.4rem' }}>
              {filtered.map((listing, i) => (
                <div key={listing.listingId} style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${i * 0.05}s` }}>
                  <ListingCard listing={listing} onClick={handleCardClick} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#12182b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
            padding: '2rem', width: '100%', maxWidth: '500px', margin: '1rem',
            animation: 'fadeUp 0.3s ease both'
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", margin: '0 0 1.5rem', fontSize: '1.8rem' }}>Create New Listing</h2>
            
            <form onSubmit={submitNewListing} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" placeholder="Title" required
                value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})}
                style={inputStyle}
              />
              
              <textarea 
                placeholder="Description" rows="3" required
                value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})}
                style={{...inputStyle, resize: 'vertical'}}
              />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="number" placeholder="Price ($)" min="0" step="0.01" required
                  value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})}
                  style={{...inputStyle, flex: 1}}
                />
                
                <select 
                  value={newListing.condition} onChange={e => setNewListing({...newListing, condition: e.target.value})}
                  style={{...inputStyle, flex: 1}}
                >
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <select 
                value={newListing.category_id} onChange={e => setNewListing({...newListing, category_id: e.target.value})}
                style={inputStyle}
              >
                {/* Adjust values to match your actual database category IDs */}
                <option value="1">Textbooks</option>
                <option value="2">Electronics</option>
                <option value="3">Furniture</option>
                <option value="4">Appliances</option>
                <option value="5">Lab Supplies</option>
                <option value="6">Misc</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={btnStyleSecondary}>Cancel</button>
                <button type="submit" style={btnStylePrimary}>Post Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  )
}

// Inline styles for the modal inputs
const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '0.8rem 1rem', color: '#fff',
  fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none'
}

const btnStyleSecondary = {
  background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
  padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontFamily: "'DM Mono', monospace"
}

const btnStylePrimary = {
  background: '#F5A623', color: '#000', border: 'none', fontWeight: 'bold',
  padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontFamily: "'DM Mono', monospace"
}

function LoadingSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.4rem',
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          overflow: 'hidden',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.1}s`,
        }}>
          <div style={{ paddingTop: '65%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ padding: '1rem' }}>
            <div style={{ height: '14px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '70%' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function EmptyState({ search }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '5rem 2rem',
      color: 'rgba(255,255,255,0.25)',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📭</div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', margin: '0 0 0.5rem', color: 'rgba(255,255,255,0.4)' }}>
        No listings found
      </p>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', margin: 0 }}>
        {search ? `Nothing matched "${search}"` : 'Check back later — the campus is always selling something.'}
      </p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App