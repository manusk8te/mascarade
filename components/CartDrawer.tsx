'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } =
    useCartStore()
  const cartTotal = total()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '400px',
          maxWidth: '100vw',
          backgroundColor: '#FFFFFF',
          borderLeft: '0.5px solid #E5E5E5',
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '0.5px solid #E5E5E5',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Panier
          </h2>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#000',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: '#999999',
                textTransform: 'uppercase',
              }}
            >
              Panier vide
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {items.map((item) => (
                <li
                  key={item.variantId}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 24px',
                    borderBottom: '0.5px solid #E5E5E5',
                  }}
                >
                  {/* Photo */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      flexShrink: 0,
                      backgroundColor: '#F5F5F5',
                      overflow: 'hidden',
                    }}
                  >
                    {item.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.photoUrl}
                        alt={item.productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#F0F0F0',
                        }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        margin: '0 0 2px',
                        color: '#000',
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
                        margin: '0 0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: item.variantColorHex,
                          border: '0.5px solid #E5E5E5',
                        }}
                      />
                      {item.variantColorName}
                    </p>

                    {/* Qty controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQty(item.variantId, item.quantity - 1)
                          }
                          style={{
                            background: 'none',
                            border: '0.5px solid #E5E5E5',
                            cursor: 'pointer',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: '#000',
                            padding: 0,
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontFamily: 'system-ui, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.7rem',
                            minWidth: '16px',
                            textAlign: 'center',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.variantId, item.quantity + 1)
                          }
                          style={{
                            background: 'none',
                            border: '0.5px solid #E5E5E5',
                            cursor: 'pointer',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: '#000',
                            padding: 0,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <p
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontWeight: 300,
                          fontSize: '0.7rem',
                          color: '#000',
                          margin: 0,
                        }}
                      >
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      color: '#999',
                      alignSelf: 'flex-start',
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '0.5px solid #E5E5E5',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
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
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                textAlign: 'center',
                padding: '14px 0',
                textDecoration: 'none',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: '0.5px solid #000',
              }}
            >
              Commander
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
