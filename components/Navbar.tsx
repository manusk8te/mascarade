'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

const NAV_CATEGORIES = ['Vénitien', 'Loup', 'Papillon', 'Plumes', 'Baroque']

export default function Navbar() {
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()

  return (
    <nav
      style={{
        borderBottom: '0.5px solid #E5E5E5',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.875rem',
            letterSpacing: '0.2em',
            color: '#000000',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          Mascarade
        </Link>

        {/* Nav Links */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          className="hidden md:flex"
        >
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#000000',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Cart Icon */}
        <button
          onClick={openCart}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: '#000000',
            textTransform: 'uppercase',
            padding: '4px 0',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {count > 0 && (
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.05em',
                color: '#000',
              }}
            >
              ({count})
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
