import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import type { CartItem, ShippingAddress } from '@/lib/types'

interface CheckoutBody {
  items: CartItem[]
  customer: {
    email: string
    name: string
    address: ShippingAddress
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, customer } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide.' },
        { status: 400 }
      )
    }

    if (!customer?.email) {
      return NextResponse.json(
        { error: 'Email client requis.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify stock for each variant
    const variantIds = items.map((item) => item.variantId)
    const { data: variants, error: variantError } = await supabase
      .from('product_variants')
      .select('id, stock, color_name')
      .in('id', variantIds)

    if (variantError) {
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du stock.' },
        { status: 500 }
      )
    }

    // Check stock
    for (const item of items) {
      const variant = variants?.find((v) => v.id === item.variantId)
      if (!variant) {
        return NextResponse.json(
          { error: `Variante introuvable pour ${item.productName}.` },
          { status: 400 }
        )
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuffisant pour ${item.productName} (${variant.color_name}). Disponible : ${variant.stock}.`,
          },
          { status: 400 }
        )
      }
    }

    // Calculate total
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        client_email: customer.email,
        client_name: customer.name,
        shipping_address: customer.address,
        total,
        status: 'pending',
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande.' },
        { status: 500 }
      )
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement des articles.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
}
