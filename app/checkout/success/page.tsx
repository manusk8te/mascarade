'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '48px 24px',
        textAlign: 'center',
        gap: '24px',
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="0.75"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '1.25rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#000',
          margin: 0,
        }}
      >
        Commande confirmée
      </h1>

      {orderId && (
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.7rem',
            color: '#999',
            letterSpacing: '0.1em',
            margin: 0,
          }}
        >
          Référence :{' '}
          <span style={{ color: '#000', fontFamily: 'monospace' }}>
            #{orderId.split('-')[0].toUpperCase()}
          </span>
        </p>
      )}

      <p
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.75rem',
          color: '#999',
          lineHeight: 1.7,
          maxWidth: '400px',
          margin: 0,
        }}
      >
        Vous recevrez un email de confirmation dans quelques minutes.
        <br />
        Merci pour votre commande.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '16px',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '14px 40px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          border: '0.5px solid #000',
        }}
      >
        Continuer mes achats
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
          }}
        />
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
