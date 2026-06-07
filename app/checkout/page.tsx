'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'

interface FormData {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  postalCode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const cartTotal = total()

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            email: form.email,
            name: `${form.firstName} ${form.lastName}`.trim(),
            address: {
              firstName: form.firstName,
              lastName: form.lastName,
              address: form.address,
              city: form.city,
              postalCode: form.postalCode,
            },
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      clearCart()
      router.push(`/checkout/success?orderId=${data.orderId}`)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    borderBottom: '0.5px solid #000',
    padding: '10px 0',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 300,
    fontSize: '0.85rem',
    color: '#000',
    backgroundColor: 'transparent',
    outline: 'none',
    borderRadius: 0,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 300,
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#999',
    marginBottom: '6px',
    display: 'block',
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: '16px',
        }}
      >
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            color: '#999',
          }}
        >
          Votre panier est vide
        </p>
        <Link
          href="/"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#000',
          }}
        >
          Continuer mes achats
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          margin: '0 0 48px',
          color: '#000',
        }}
      >
        Commander
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '80px',
          alignItems: 'start',
        }}
        className="flex flex-col md:grid"
      >
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#000',
                margin: '0 0 24px',
              }}
            >
              Coordonnées
            </h2>

            {/* First / Last name */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label style={labelStyle}>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Marie"
                />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Dupont"
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="marie@email.com"
              />
            </div>
          </div>

          {/* Shipping */}
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#000',
                margin: '0 0 24px',
              }}
            >
              Livraison
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="12 rue de la Paix"
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}
            >
              <div>
                <label style={labelStyle}>Ville</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Paris"
                />
              </div>
              <div>
                <label style={labelStyle}>Code postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="75001"
                />
              </div>
            </div>
          </div>

          {error && (
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.7rem',
                color: '#cc0000',
                marginBottom: '16px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#999' : '#000000',
              color: '#FFFFFF',
              border: '0.5px solid #000',
              padding: '16px 0',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'En cours…' : 'Confirmer la commande'}
          </button>
        </form>

        {/* Summary */}
        <div
          style={{
            borderTop: '0.5px solid #E5E5E5',
            paddingTop: '0',
          }}
        >
          <h2
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#000',
              margin: '0 0 24px',
              paddingTop: '0',
            }}
          >
            Récapitulatif
          </h2>

          <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.variantId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '0.5px solid #E5E5E5',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {item.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt={item.productName}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.7rem',
                        color: '#000',
                        margin: '0 0 2px',
                      }}
                    >
                      {item.productName}
                    </p>
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.6rem',
                        color: '#999',
                        margin: 0,
                      }}
                    >
                      {item.variantColorName} · Qté {item.quantity}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.7rem',
                    color: '#000',
                    flexShrink: 0,
                  }}
                >
                  {(item.price * item.quantity).toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.65rem',
                  color: '#999',
                }}
              >
                Sous-total
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.65rem',
                  color: '#000',
                }}
              >
                {cartTotal.toFixed(2)} €
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.65rem',
                  color: '#999',
                }}
              >
                Livraison
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.65rem',
                  color: '#000',
                }}
              >
                Gratuite
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '0.5px solid #E5E5E5',
                paddingTop: '12px',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#000',
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.7rem',
                  color: '#000',
                }}
              >
                {cartTotal.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
