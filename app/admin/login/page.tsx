'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(`Erreur : ${error.message}`)
      setLoading(false)
      return
    }

    // Cookie simple pour que le layout détecte la session sans async
    document.cookie = 'maison_admin=1; path=/; max-age=604800; SameSite=Lax'
    window.location.href = '/admin/products'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    borderBottom: '0.5px solid #000',
    padding: '10px 0',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 300,
    fontSize: '0.9rem',
    color: '#000',
    backgroundColor: 'transparent',
    outline: 'none',
    borderRadius: 0,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#FFFFFF',
          padding: '48px 40px',
          border: '0.5px solid #E5E5E5',
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.8rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#000',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Maison Mode
          </Link>
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#999',
              margin: 0,
            }}
          >
            Administration
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#999',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="admin@maison.com"
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#999',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                color: '#cc0000',
                margin: 0,
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
              padding: '14px 0',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              marginTop: '8px',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
