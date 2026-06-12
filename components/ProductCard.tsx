'use client'
import Link from 'next/link'
import type { Product, ProductVariant } from '@/lib/types'

interface ProductCardProps {
  product: Product
  variant: ProductVariant | null
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const imageUrl = variant?.photo_url || null

  return (
    <Link
      href={`/products/${product.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
        }}
        className="product-card-hover"
      >
        {/* Image carrée */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '100%',
            backgroundColor: '#F5F5F5',
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F0F0F0',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#CCCCCC"
                strokeWidth="0.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="0" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '12px 0 16px' }}>
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 400,
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#000000',
              margin: '0 0 4px',
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </p>
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.65rem',
              color: '#999999',
              margin: 0,
            }}
          >
            {Number(product.price).toLocaleString('fr-FR')} F CFA
          </p>
        </div>
      </div>

      <style>{`
        .product-card-hover:hover { transform: translateY(-2px); }
      `}</style>
    </Link>
  )
}
