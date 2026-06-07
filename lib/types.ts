import type { Category } from './constants'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: Category
  is_published: boolean
  created_at: string
  product_variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  photo_url: string | null
  stock: number
  position: number
}

export interface Order {
  id: string
  client_email: string
  client_name: string | null
  shipping_address: ShippingAddress | null
  status: string
  total: number
  created_at: string
  order_items?: OrderItem[]
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  price_at_purchase: number
  product?: Product
  variant?: ProductVariant
}

export interface CartItem {
  productId: string
  variantId: string
  productName: string
  variantColorName: string
  variantColorHex: string
  photoUrl: string | null
  price: number
  quantity: number
}
