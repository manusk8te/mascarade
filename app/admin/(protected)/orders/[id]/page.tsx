import { createAdminClient } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Order, OrderItem } from '@/lib/types'

interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: { name: string; price: number } | null
    variant: { color_name: string; color_hex: string; photo_url: string | null } | null
  })[]
}

async function getOrder(id: string): Promise<OrderWithItems | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *,
          product:products (name, price),
          variant:product_variants (color_name, color_hex, photo_url)
        )
      `
      )
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as OrderWithItems
  } catch {
    return null
  }
}

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  if (!order) {
    return (
      <div
        style={{
          padding: '40px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.7rem',
          color: '#999',
        }}
      >
        Commande introuvable.{' '}
        <Link href="/admin/orders" style={{ color: '#000' }}>
          ← Retour
        </Link>
      </div>
    )
  }

  const date = new Date(order.created_at)
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const address = order.shipping_address

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        <Link
          href="/admin/orders"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.6rem',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          ← Retour
        </Link>
        <h1
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#000',
            margin: 0,
          }}
        >
          Commande #{order.id.split('-')[0].toUpperCase()}
        </h1>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#999',
            border: '0.5px solid #E5E5E5',
          }}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Info client */}
        <section>
          <h2
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
              margin: '0 0 16px',
            }}
          >
            Informations client
          </h2>
          <div
            style={{
              border: '0.5px solid #E5E5E5',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#999',
                  margin: '0 0 4px',
                }}
              >
                Nom
              </p>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: '#000',
                  margin: 0,
                }}
              >
                {order.client_name || '—'}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#999',
                  margin: '0 0 4px',
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: '#000',
                  margin: 0,
                }}
              >
                {order.client_email}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#999',
                  margin: '0 0 4px',
                }}
              >
                Date
              </p>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: '#000',
                  margin: 0,
                }}
              >
                {formattedDate}
              </p>
            </div>
          </div>
        </section>

        {/* Adresse */}
        {address && (
          <section>
            <h2
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#999',
                margin: '0 0 16px',
              }}
            >
              Adresse de livraison
            </h2>
            <div
              style={{
                border: '0.5px solid #E5E5E5',
                padding: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: '#000',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {address.firstName} {address.lastName}
                <br />
                {address.address}
                <br />
                {address.postalCode} {address.city}
              </p>
            </div>
          </section>
        )}

        {/* Articles */}
        <section>
          <h2
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
              margin: '0 0 16px',
            }}
          >
            Articles commandés
          </h2>

          <div style={{ border: '0.5px solid #E5E5E5' }}>
            {order.order_items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom:
                    index < order.order_items.length - 1
                      ? '0.5px solid #E5E5E5'
                      : 'none',
                  alignItems: 'center',
                }}
              >
                {/* Photo */}
                {item.variant?.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.variant.photo_url}
                    alt={item.product?.name || ''}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      flexShrink: 0,
                      border: '0.5px solid #E5E5E5',
                    }}
                  />
                )}

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.75rem',
                      color: '#000',
                      margin: '0 0 4px',
                    }}
                  >
                    {item.product?.name || 'Produit supprimé'}
                  </p>
                  {item.variant && (
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.65rem',
                        color: '#999',
                        margin: '0 0 4px',
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
                          backgroundColor: item.variant.color_hex,
                          border: '0.5px solid #E5E5E5',
                        }}
                      />
                      {item.variant.color_name}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.65rem',
                      color: '#999',
                      margin: 0,
                    }}
                  >
                    Qté : {item.quantity}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.75rem',
                      color: '#000',
                      margin: '0 0 2px',
                    }}
                  >
                    {(item.price_at_purchase * item.quantity).toFixed(2)} €
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
                    {item.price_at_purchase.toFixed(2)} € / unité
                  </p>
                </div>
              </div>
            ))}

            {/* Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderTop: '0.5px solid #E5E5E5',
                backgroundColor: '#FAFAFA',
              }}
            >
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.65rem',
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
                  fontSize: '0.75rem',
                  color: '#000',
                }}
              >
                {Number(order.total).toFixed(2)} €
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
