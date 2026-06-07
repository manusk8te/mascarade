'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const NAV_CATEGORIES = ['Vénitien', 'Loup', 'Papillon', 'Plumes', 'Baroque']

export default function Navbar() {
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasAuth = document.cookie.split(';').some(c => c.trim().startsWith('maison_admin='))
    setIsAdmin(hasAuth)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Identifiants incorrects'); setLoading(false); return }
    document.cookie = 'maison_admin=1; path=/; max-age=604800; SameSite=Lax'
    setIsAdmin(true)
    setMenuOpen(false)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'maison_admin=; path=/; max-age=0'
    setIsAdmin(false)
    setMenuOpen(false)
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#FFFFFF', borderBottom: '0.5px solid #E5E5E5' }}>

      {/* ── Barre principale ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '0.25em', color: '#000', textDecoration: 'none', textTransform: 'uppercase', flexShrink: 0 }}>
          Mascarade
        </Link>

        {/* Desktop nav links (cachés sur mobile) */}
        <div className="hidden md:flex" style={{ gap: '28px', alignItems: 'center' }}>
          {NAV_CATEGORIES.map(cat => (
            <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`}
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#000', textDecoration: 'none', textTransform: 'uppercase' }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Droite : admin (desktop) + panier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Admin — desktop seulement */}
          <div className="hidden md:block" style={{ position: 'relative' }} ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 0', color: '#000' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              {isAdmin && <span style={{ fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin</span>}
            </button>

            {menuOpen && (
              <div className="nav-dropdown" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, backgroundColor: '#FFFFFF', border: '0.5px solid #E5E5E5', width: '260px', zIndex: 100, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                {isAdmin ? (
                  <div style={{ padding: '8px 0' }}>
                    <p style={{ fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', padding: '10px 20px 6px', margin: 0 }}>Administration</p>
                    {[{ href: '/admin/products', label: 'Produits' }, { href: '/admin/orders', label: 'Commandes' }].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 20px', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '0.5px solid #E5E5E5', marginTop: '8px' }}>
                      <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '24px 20px' }}>
                    <p style={{ fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', margin: '0 0 16px' }}>Espace administration</p>
                    <div style={{ backgroundColor: '#F9F9F9', border: '0.5px solid #E5E5E5', padding: '10px 12px', marginBottom: '16px' }}>
                      <p style={{ fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.6rem', color: '#999', margin: 0, lineHeight: 1.6 }}>
                        Pas besoin de compte pour commander.
                      </p>
                    </div>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email admin" required
                        style={{ border: 'none', borderBottom: '0.5px solid #000', padding: '8px 0', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.8rem', outline: 'none', backgroundColor: 'transparent', width: '100%' }} />
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required
                        style={{ border: 'none', borderBottom: '0.5px solid #000', padding: '8px 0', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.8rem', outline: 'none', backgroundColor: 'transparent', width: '100%' }} />
                      {error && <p style={{ fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.6rem', color: '#cc0000', margin: 0 }}>{error}</p>}
                      <button type="submit" disabled={loading}
                        style={{ backgroundColor: loading ? '#999' : '#000', color: '#FFF', border: 'none', padding: '10px 0', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', marginTop: '4px' }}>
                        {loading ? 'Connexion…' : 'Se connecter'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panier — toujours visible */}
          <button onClick={openCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', color: '#000' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '0px', right: '0px',
                backgroundColor: '#000', color: '#FFF',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'system-ui', fontWeight: 400,
              }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Barre catégories mobile (sous le logo) ── */}
      <div className="flex md:hidden" style={{ borderTop: '0.5px solid #E5E5E5', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <Link href="/" style={{ padding: '10px 14px', whiteSpace: 'nowrap', textDecoration: 'none', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', flexShrink: 0 }}>
          Tout
        </Link>
        {NAV_CATEGORIES.map(cat => (
          <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`}
            style={{ padding: '10px 14px', whiteSpace: 'nowrap', textDecoration: 'none', fontFamily: 'system-ui', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', flexShrink: 0 }}>
            {cat}
          </Link>
        ))}
      </div>

    </header>
  )
}
