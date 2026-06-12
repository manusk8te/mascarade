import { createAdminClient } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Order } from '@/lib/types'

async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return []
    return (data as Order[]) || []
  } catch {
    return []
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

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div style={{ padding: '40px' }}>
      <h1
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#000',
          margin: '0 0 40px',
        }}
      >
        Commandes
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 0',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.7rem',
            color: '#999',
            letterSpacing: '0.1em',
            border: '0.5px solid #E5E5E5',
          }}
        >
          Aucune commande
        </div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '0.5px solid #E5E5E5' }}>
              {['Date', 'Client', 'Statut', 'Total', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.55rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#999',
                    padding: '12px 16px',
                    textAlign: 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const date = new Date(order.created_at)
              const formattedDate = date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })

              return (
                <tr
                  key={order.id}
                  style={{ borderBottom: '0.5px solid #E5E5E5' }}
                >
                  <td
                    style={{
                      padding: '16px',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.7rem',
                      color: '#999',
                    }}
                  >
                    {formattedDate}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.75rem',
                      color: '#000',
                    }}
                  >
                    {order.client_email}
                    {order.client_name && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          color: '#999',
                          marginTop: '2px',
                        }}
                      >
                        {order.client_name}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.55rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: order.status === 'pending' ? '#999' : '#000',
                        border: `0.5px solid ${order.status === 'pending' ? '#E5E5E5' : '#000'}`,
                      }}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.75rem',
                      color: '#000',
                    }}
                  >
                    {Number(order.total).toLocaleString('fr-FR')} F CFA
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#000',
                        textDecoration: 'none',
                        borderBottom: '0.5px solid #000',
                      }}
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
