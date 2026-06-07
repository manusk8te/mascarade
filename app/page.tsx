import { createClient } from '@supabase/supabase-js'
import { Suspense } from 'react'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import type { Product, ProductVariant } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import Link from 'next/link'

async function getPublishedProducts(): Promise<
  (Product & { product_variants: ProductVariant[] })[]
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return []

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data as (Product & { product_variants: ProductVariant[] })[]) || []
}

export const revalidate = 60

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const allProducts = await getPublishedProducts()
  const selectedCategory = searchParams.category
  const searchQuery = searchParams.search?.toLowerCase().trim()

  const products = allProducts.filter((p) => {
    const matchCat = selectedCategory ? p.category === selectedCategory : true
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
      : true
    return matchCat && matchSearch
  })

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        height: '70vh', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', backgroundColor: '#000',
      }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif', fontWeight: 300,
            fontSize: '2rem', letterSpacing: '0.15em',
            color: '#FFFFFF', margin: '0 0 8px', lineHeight: 1.3,
          }}>
            Le masque fait le bal.
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif', fontWeight: 300,
            fontSize: '0.75rem', letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.6)', margin: 0, textTransform: 'uppercase',
          }}>
            14 styles · plusieurs coloris
          </p>
        </div>
      </section>

      {/* Filters + Search */}
      <section style={{ borderBottom: '0.5px solid #E5E5E5' }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>

          {/* Categories */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', flex: 1 }}>
            <Link href={searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : '/'}
              style={{
                padding: '14px 20px', whiteSpace: 'nowrap', textDecoration: 'none',
                fontFamily: 'system-ui, sans-serif', fontWeight: !selectedCategory ? 400 : 300,
                fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: !selectedCategory ? '#000' : '#999',
                borderBottom: !selectedCategory ? '1px solid #000' : '1px solid transparent',
              }}>
              Tout
            </Link>
            {CATEGORIES.map((cat) => (
              <Link key={cat}
                href={`/?category=${encodeURIComponent(cat)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                style={{
                  padding: '14px 20px', whiteSpace: 'nowrap', textDecoration: 'none',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: selectedCategory === cat ? 400 : 300,
                  fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: selectedCategory === cat ? '#000' : '#999',
                  borderBottom: selectedCategory === cat ? '1px solid #000' : '1px solid transparent',
                }}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ flexShrink: 0, padding: '10px 0' }}>
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {products.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '300px', gap: 16,
          }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif', fontWeight: 300,
              fontSize: '0.75rem', letterSpacing: '0.1em', color: '#999',
              textTransform: 'uppercase', margin: 0,
            }}>
              {searchQuery ? `Aucun résultat pour "${searchParams.search}"` : 'Aucun masque disponible'}
            </p>
            {searchQuery && (
              <Link href="/" style={{
                fontFamily: 'system-ui, sans-serif', fontWeight: 300,
                fontSize: '0.65rem', letterSpacing: '0.12em',
                color: '#000', textTransform: 'uppercase',
              }}>
                Effacer la recherche
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
            className="md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => {
              const variants = product.product_variants || []
              const primaryVariant = variants.find((v) => v.position === 0) || variants[0] || null
              const cols = 4
              const isLastRow = index >= products.length - (products.length % cols || cols)
              const isLastInRow = (index + 1) % cols === 0

              return (
                <div key={product.id} style={{
                  borderRight: isLastInRow ? 'none' : '0.5px solid #E5E5E5',
                  borderBottom: isLastRow ? 'none' : '0.5px solid #E5E5E5',
                }}>
                  <div style={{ padding: '16px' }}>
                    <ProductCard product={product} variant={primaryVariant} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #E5E5E5', marginTop: '80px', padding: '40px 24px' }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif', fontWeight: 300,
            fontSize: '0.6rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#999',
          }}>
            Mascarade © 2025
          </span>
          <span style={{
            fontFamily: 'system-ui, sans-serif', fontWeight: 300,
            fontSize: '0.6rem', letterSpacing: '0.1em', color: '#999',
          }}>
            Livraison offerte dès 80€
          </span>
        </div>
      </footer>
    </div>
  )
}
