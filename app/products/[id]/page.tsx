'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import ColorSwatch from '@/components/ColorSwatch'
import type { Product, ProductVariant } from '@/lib/types'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  )
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [imageVisible, setImageVisible] = useState(true)
  const [added, setAdded] = useState(false)

  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (productError || !productData) {
        setLoading(false)
        return
      }

      const { data: variantData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('position', { ascending: true })

      setProduct(productData as Product)
      const vars = (variantData as ProductVariant[]) || []
      setVariants(vars)
      setSelectedVariant(vars[0] || null)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  const handleVariantChange = (variant: ProductVariant) => {
    setImageVisible(false)
    setTimeout(() => {
      setSelectedVariant(variant)
      setImageVisible(true)
    }, 200)
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantColorName: selectedVariant.color_name,
      variantColorHex: selectedVariant.color_hex,
      photoUrl: selectedVariant.photo_url,
      price: Number(product.price),
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          color: '#999',
        }}
      >
        Chargement…
      </div>
    )
  }

  if (!product) {
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
          Produit introuvable
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
          ← Retour
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0',
        minHeight: '80vh',
      }}
    >
      {/* Breadcrumb */}
      <div
        className="product-breadcrumb"
        style={{
          padding: '16px 40px',
          borderBottom: '0.5px solid #E5E5E5',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          Accueil
        </Link>
        <span style={{ color: '#999', margin: '0 8px', fontSize: '0.6rem' }}>
          /
        </span>
        <span
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: '#000',
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          minHeight: '80vh',
        }}
        className="flex flex-col md:grid"
      >
        {/* Left - Image */}
        <div
          style={{
            borderRight: '0.5px solid #E5E5E5',
            position: 'relative',
          }}
        >
          <div
            className="product-image-sticky"
            style={{
              position: 'sticky',
              top: '56px',
              width: '100%',
              paddingBottom: '100%',
              backgroundColor: '#F5F5F5',
              overflow: 'hidden',
            }}
          >
            {selectedVariant?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedVariant.photo_url}
                alt={`${product.name} — ${selectedVariant.color_name}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageVisible ? 1 : 0,
                  transition: 'opacity 0.2s ease',
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
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#CCCCCC"
                  strokeWidth="0.5"
                >
                  <rect x="3" y="3" width="18" height="18" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right - Info */}
        <div
          className="product-info-panel"
          style={{
            padding: '48px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Category */}
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
              margin: 0,
            }}
          >
            {product.category}
          </p>

          {/* Name & Price */}
          <div>
            <h1
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '1.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#000',
                margin: '0 0 12px',
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '1rem',
                color: '#999',
                margin: 0,
              }}
            >
              {Number(product.price).toLocaleString('fr-FR')} F CFA
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.8rem',
                color: '#333',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {product.description}
            </p>
          )}

          {/* Color Swatches */}
          {variants.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#000',
                  margin: '0 0 12px',
                }}
              >
                Couleur
                {selectedVariant && (
                  <span
                    style={{
                      fontWeight: 300,
                      color: '#999',
                      marginLeft: '8px',
                    }}
                  >
                    — {selectedVariant.color_name}
                  </span>
                )}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {variants.map((variant) => (
                  <ColorSwatch
                    key={variant.id}
                    colorHex={variant.color_hex}
                    colorName={variant.color_name}
                    isSelected={selectedVariant?.id === variant.id}
                    onClick={() => handleVariantChange(variant)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stock warning */}
          {selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0 && (
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                color: '#999',
                margin: 0,
              }}
            >
              Plus que {selectedVariant.stock} en stock
            </p>
          )}

          {/* Out of stock */}
          {selectedVariant && selectedVariant.stock === 0 && (
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                color: '#999',
                margin: 0,
              }}
            >
              Rupture de stock
            </p>
          )}

          {/* Quantity */}
          <div>
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#000',
                margin: '0 0 12px',
              }}
            >
              Quantité
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '0.5px solid #E5E5E5',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '1rem',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.9rem',
                  minWidth: '24px',
                  textAlign: 'center',
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '0.5px solid #E5E5E5',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '1rem',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            style={{
              width: '100%',
              backgroundColor:
                selectedVariant && selectedVariant.stock > 0
                  ? '#000000'
                  : '#E5E5E5',
              color:
                selectedVariant && selectedVariant.stock > 0
                  ? '#FFFFFF'
                  : '#999999',
              border: '0.5px solid #000',
              padding: '16px 0',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor:
                selectedVariant && selectedVariant.stock > 0
                  ? 'pointer'
                  : 'not-allowed',
              transition: 'background-color 0.2s ease',
            }}
          >
            {added
              ? 'Ajouté ✓'
              : selectedVariant && selectedVariant.stock === 0
                ? 'Rupture de stock'
                : 'Ajouter au panier'}
          </button>

          {/* Details */}
          <div
            style={{
              borderTop: '0.5px solid #E5E5E5',
              paddingTop: '24px',
            }}
          >
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                color: '#999',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              Livraison gratuite · Retours sous 14 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
