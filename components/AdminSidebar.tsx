'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/products', label: 'Produits' },
    { href: '/admin/orders', label: 'Commandes' },
  ]

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: '200px',
        minHeight: '100vh',
        borderRight: '0.5px solid #E5E5E5',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Brand */}
      <div
        className="admin-sidebar-brand"
        style={{
          padding: '24px 20px',
          borderBottom: '0.5px solid #E5E5E5',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#000',
            textDecoration: 'none',
          }}
        >
          Maison Mode
        </Link>
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#999',
            margin: '4px 0 0',
          }}
        >
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav" style={{ flex: 1, padding: '20px 0' }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: isActive ? 400 : 300,
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isActive ? '#000' : '#999',
                textDecoration: 'none',
                borderLeft: isActive ? '1px solid #000' : '1px solid transparent',
                transition: 'color 0.2s ease',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="admin-sidebar-logout" style={{ padding: '20px', borderTop: '0.5px solid #E5E5E5' }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#999',
            padding: 0,
            transition: 'color 0.2s ease',
          }}
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
