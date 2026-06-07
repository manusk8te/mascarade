'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('search') || '')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const q = value.trim()
      const category = params.get('category') || ''
      const url = new URLSearchParams()
      if (q) url.set('search', q)
      if (category) url.set('category', category)
      router.push(`/?${url.toString()}`)
    },
    [value, params, router]
  )

  const handleClear = () => {
    setValue('')
    const category = params.get('category') || ''
    router.push(category ? `/?category=${encodeURIComponent(category)}` : '/')
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Rechercher un masque..."
        style={{
          width: '100%',
          height: 36,
          padding: '0 36px 0 12px',
          border: '0.5px solid #E5E5E5',
          borderRadius: 0,
          background: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          color: '#000',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#000')}
        onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#999', fontSize: '0.8rem', padding: 0, lineHeight: 1,
          }}
        >
          ✕
        </button>
      ) : (
        <svg
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      )}
    </form>
  )
}
