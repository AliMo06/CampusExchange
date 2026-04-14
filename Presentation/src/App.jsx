import { useState, useEffect, Maps } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
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

// ─── Mock data – replace with real API calls ──────────────────────────────────
const MOCK_LISTINGS = [
  { listingId: 1, title: 'Calculus: Early Transcendentals 9th Ed', description: 'Barely used. Highlights in chapter 3 only. Perfect for MATH 151.', price: 45, condition: 'like_new', category: 'Textbooks', imageUrl: null },
  { listingId: 2, title: 'Standing Desk Converter', description: 'FlexiSpot brand. Elevates any desk to standing height. Moving out.', price: 60, condition: 'good', category: 'Furniture', imageUrl: null },
  { listingId: 3, title: 'TI-84 Plus CE Graphing Calculator', description: 'Works perfectly. Comes with USB cable and extra batteries.', price: 70, condition: 'good', category: 'Electronics', imageUrl: null },
  { listingId: 4, title: 'Dorm Room Microwave 700W', description: 'Compact Black+Decker. 1 year old, no issues whatsoever.', price: 30, condition: 'good', category: 'Appliances', imageUrl: null },
  { listingId: 5, title: 'Organic Chemistry Model Kit', description: 'Molymod brand. Complete set. Great for CHEM 201 students.', price: 20, condition: 'like_new', category: 'Lab Supplies', imageUrl: null },
  { listingId: 6, title: 'IKEA LACK Shelf Set (x2)', description: 'White. Some scuff marks. Easy to mount. Selling both together.', price: 15, condition: 'fair', category: 'Furniture', imageUrl: null },
  { listingId: 7, title: 'Noise Cancelling Headphones Sony WH-1000XM4', description: 'Mint condition. Comes with original case and 3.5mm cable.', price: 180, condition: 'like_new', category: 'Electronics', imageUrl: null },
  { listingId: 8, title: 'Principles of Economics (Mankiw)', description: 'Required for ECON 101. Has some pen marks in margins.', price: 25, condition: 'fair', category: 'Textbooks', imageUrl: null },
  { listingId: 9, title: 'Reusable Grocery Bags (10 pack)', description: 'Never used. Still in packaging. Earth-friendly tote bags.', price: null, condition: 'new', category: 'Misc', imageUrl: null },
]

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Appliances', 'Lab Supplies', 'Misc']

function HomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    loadFonts()
    setMounted(true)

    // Simulate fetching listings from /api/listings
    const fetchListings = async () => {
      try {
        // TODO: replace with real fetch
        // const res = await fetch('/api/listings')
        // const data = await res.json()
        // setListings(data)
        await new Promise(r => setTimeout(r, 600))
        setListings(MOCK_LISTINGS)
      } catch (err) {
        console.error('Failed to load listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Filter listings
  const filtered = listings.filter(l => {
    const matchSearch = search.trim() === '' ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
    const matchCat = activeCategory === 'All' || l.category === activeCategory
    return matchSearch && matchCat
  })

  const handleLogin = () => {
    // 2. Call the navigate variable with your desired route
    navigate('/login');
  }

  const handleSignup = () => {
    // 3. Do the same for the signup route
    navigate('/signup');
  }

  const handleCreateListing = () => {
    // Example if you add a route for this later:
    // navigate('/create-listing');
    alert('Navigate to create listing page');
  }

  const handleCardClick = (listing) => {
    // TODO: navigate to listing detail page
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
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,120,245,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar
          user={user}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onCreateListing={handleCreateListing}
        />

        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>

          {/* Hero heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: '800',
              color: '#fff',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
              margin: '0 0 0.6rem',
            }}>
              Buy, sell & swap<br />
              <span style={{ color: '#F5A623' }}>on campus.</span>
            </h1>
            <p style={{
              fontFamily: "'Lora', serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}>
              Everything your campus community is offering right now.
            </p>
          </div>

          {/* Search + filter bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2.2rem',
          }}>
            {/* Search input */}
            <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.35,
                fontSize: '0.9rem',
                pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  color: '#fff',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Category pills */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat
                      ? 'rgba(245,166,35,0.18)'
                      : 'rgba(255,255,255,0.05)',
                    color: activeCategory === cat
                      ? '#F5A623'
                      : 'rgba(255,255,255,0.5)',
                    border: activeCategory === cat
                      ? '1px solid rgba(245,166,35,0.4)'
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '0.35rem 0.9rem',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.72rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '1.2rem',
              letterSpacing: '0.04em',
            }}>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Listings grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.4rem',
            }}>
              {filtered.map((listing, i) => (
                <div
                  key={listing.listingId}
                  style={{
                    animation: `fadeUp 0.4s ease both`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <ListingCard listing={listing} onClick={handleCardClick} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  )
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
      </Routes>
    </BrowserRouter>
  )
}

export default App