import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, price, category, is_published, variants } = body

  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .insert({ name, description: description || null, price, category, is_published })
    .select('id')
    .single()

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]
    if (!v.color_name) continue
    await supabaseAdmin.from('product_variants').insert({
      product_id: product.id,
      color_name: v.color_name,
      color_hex: v.color_hex,
      stock: v.stock,
      photo_url: v.photo_url || null,
      position: i,
    })
  }

  return NextResponse.json({ id: product.id })
}
