import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Listing() {
  const { id } = useParams() // Grabs the listing ID from the URL
  const navigate = useNavigate()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch the individual listing data
    const fetchListing = async () => {
      try {
        setLoading(true)
        // IMPORTANT: See note below about this backend route!
        const res = await fetch(`http://localhost:3000/api/listings/${id}`)
        
        if (!res.ok) {
          throw new Error('Listing not found')
        }
        
        const data = await res.json()
        setListing(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleMakeOffer = () => {
    // Navigates to a future messaging route, passing the listing and seller context
    // You can build out the '/messages' route later!
    navigate(`/messages/new?seller=${listing.sellerId}&listing=${listing.listingId}`)
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '5rem' }}>Loading listing details...</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Oops!</h2>
          <p style={{ opacity: 0.6 }}>{error || "We couldn't find that listing."}</p>
          <button onClick={() => navigate('/')} style={backBtnStyle}>← Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        <button onClick={() => navigate('/')} style={backBtnStyle}>
          ← Back to listings
        </button>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '3rem',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          
          {/* LEFT COLUMN: Image & Details */}
          <div style={{ flex: '1 1 600px' }}>
            
            {/* Image Placeholder (or actual image if you add them later) */}
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              overflow: 'hidden'
            }}>
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ opacity: 0.2, fontSize: '3rem' }}>📷 No Photo Provided</span>
              )}
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.5rem',
              margin: '0 0 1rem',
              lineHeight: '1.2'
            }}>
              {listing.title}
            </h1>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.85rem'
            }}>
              <span style={badgeStyle}>Condition: {listing.condition}</span>
              <span style={badgeStyle}>Category ID: {listing.categoryId}</span>
            </div>

            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Description</h3>
            <p style={{
              lineHeight: '1.6',
              opacity: 0.8,
              whiteSpace: 'pre-wrap', // Preserves formatting
              fontFamily: "'Lora', serif"
            }}>
              {listing.description || "No description provided by the seller."}
            </p>
          </div>

          {/* RIGHT COLUMN: Action Card */}
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: '16px',
              padding: '2rem',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#F5A623' }}>
                ${Number(listing.price).toFixed(2)}
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: '#5078f5', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {/* Placeholder for seller initial */}
                  👤
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Listed by</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Seller #{listing.sellerId}</p> 
                  {/* Note: You might want to join the users table in your DB to get their actual username! */}
                </div>
              </div>

              <button 
                onClick={handleMakeOffer}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#F5A623',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                💬 Make an Offer
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// Inline Styles
const pageStyle = {
  minHeight: '100vh',
  background: '#080c1e',
  color: '#fff',
  fontFamily: "'DM Mono', monospace",
}

const backBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  fontFamily: "'DM Mono', monospace",
  padding: 0,
  fontSize: '0.9rem',
  marginBottom: '1rem',
  transition: 'color 0.2s',
}

const badgeStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '0.3rem 0.8rem',
  borderRadius: '20px',
  textTransform: 'capitalize'
}