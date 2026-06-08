'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (product: Product) => {
    if (!confirm(`Supprimer « ${product.name} » ? Cette action est irréversible.`)) return
    setDeleting(product.id)
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== product.id))
    setDeleting(null)
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', margin: 0 }}>
          Produits
        </h1>
        <Link href="/admin/products/new" style={{ backgroundColor: '#000', color: '#FFF', textDecoration: 'none', padding: '10px 20px', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '0.5px solid #000' }}>
          Nouveau produit
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.6rem', color: '#999', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Chargement…
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.7rem', color: '#999', letterSpacing: '0.1em', border: '0.5px solid #E5E5E5' }}>
          Aucun produit
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid #E5E5E5' }}>
              {['Nom', 'Catégorie', 'Prix', 'Statut', ''].map(h => (
                <th key={h} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 400, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', padding: '12px 16px', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '0.5px solid #E5E5E5' }}>
                <td style={{ padding: '16px', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.75rem', color: '#000' }}>{product.name}</td>
                <td style={{ padding: '16px', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: '#999' }}>{product.category}</td>
                <td style={{ padding: '16px', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.75rem', color: '#000' }}>{Number(product.price).toFixed(2)} €</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: product.is_published ? '#000' : '#999', border: `0.5px solid ${product.is_published ? '#000' : '#E5E5E5'}` }}>
                    {product.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '20px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Link href={`/admin/products/${product.id}/edit`} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '0.5px solid #000' }}>
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={deleting === product.id}
                    style={{ background: 'none', border: 'none', cursor: deleting === product.id ? 'wait' : 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CC0000', padding: 0 }}
                  >
                    {deleting === product.id ? '…' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
