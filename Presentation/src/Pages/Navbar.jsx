import { useState } from 'react'

export default function Navbar({ user, onLogin, onSignup, onCreateListing }) {
  const [avatarError, setAvatarError] = useState(false)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 15, 40, 0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      height: '68px',
    }}>

      {/* Left: Create Listing button */}
      <div>
        <button
          onClick={onCreateListing}
          style={{
            background: 'linear-gradient(135deg, #F5A623, #E8831A)',
            color: '#1a0e00',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.2rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.78rem',
            fontWeight: '600',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 12px rgba(245,166,35,0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,166,35,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(245,166,35,0.25)'
          }}
        >
          <span style={{ fontSize: '1rem' }}>＋</span> New Listing
        </button>
      </div>

      {/* Center: Title */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.55rem',
          fontWeight: '700',
          color: '#fff',
          letterSpacing: '-0.01em',
        }}>
          Campus<span style={{ color: '#F5A623' }}>Exchange</span>
        </span>
      </div>

      {/* Right: Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '40px',
            padding: '0.3rem 0.75rem 0.3rem 0.3rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            {user.profilePic && !avatarError ? (
              <img
                src={user.profilePic}
                alt={user.username}
                onError={() => setAvatarError(true)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(245,166,35,0.5)',
                }}
              />
            ) : (
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623, #E8831A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'DM Mono', monospace",
                fontWeight: '700',
                fontSize: '0.85rem',
                color: '#1a0e00',
                flexShrink: 0,
              }}>
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '500',
            }}>
              {user.username}
            </span>
          </div>
        ) : (
          <>
            <button
              onClick={onLogin}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '0.5rem 1.1rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.78rem',
                fontWeight: '500',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              Log in
            </button>
            <button
              onClick={onSignup}
              style={{
                background: '#fff',
                color: '#0a0f28',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.1rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
