import { useState } from 'react'

const CONDITION_COLORS = {
  new:      { bg: 'rgba(80,200,120,0.12)', color: '#50c878', label: 'New' },
  like_new: { bg: 'rgba(80,180,200,0.12)', color: '#50b4c8', label: 'Like New' },
  good:     { bg: 'rgba(245,166,35,0.12)', color: '#F5A623', label: 'Good' },
  fair:     { bg: 'rgba(200,140,80,0.12)', color: '#c88c50', label: 'Fair' },
  poor:     { bg: 'rgba(200,80,80,0.12)',  color: '#c85050', label: 'Poor' },
}

export default function ListingCard({ listing, onClick }) {
  const [hovered, setHovered] = useState(false)
  const cond = CONDITION_COLORS[listing.condition] || CONDITION_COLORS.good

  // Grab the first image from the array if it exists
  const firstImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <div
      onClick={() => onClick && onClick(listing)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)',
        border: hovered
          ? '1px solid rgba(245,166,35,0.35)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.35)'
          : '0 2px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div style={{
        width: '100%',
        paddingTop: '65%',
        position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {firstImage ? (
          <img
            src={firstImage}
            alt={listing.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            opacity: 0.18,
          }}>
            📦
          </div>
        )}

        {/* Condition badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: cond.bg,
          color: cond.color,
          border: `1px solid ${cond.color}40`,
          borderRadius: '6px',
          padding: '0.2rem 0.55rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.68rem',
          fontWeight: '600',
          letterSpacing: '0.05em',
          backdropFilter: 'blur(8px)',
        }}>
          {cond.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.0rem',
          fontWeight: '600',
          color: '#fff',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {listing.title}
        </div>

        {listing.description && (
          <div style={{
            fontFamily: "'Lora', serif",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {listing.description}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#F5A623',
          }}>
            {listing.price != null ? `$${parseFloat(listing.price).toFixed(2)}` : 'Free'}
          </span>
          {listing.category && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {listing.category}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}