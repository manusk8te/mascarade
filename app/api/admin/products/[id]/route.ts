import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const { name, description, price, category, is_published, variants } = body

  const { error: productError } = await supabaseAdmin
    .from('products')
    .update({ name, description: description || null, price, category, is_published })
    .eq('id', id)

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  // Delete existing variants then re-insert (simplest approach)
  await supabaseAdmin.from('product_variants').delete().eq('product_id', id)

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]
    const colorName = v.color_name || 'Principal'
    await supabaseAdmin.from('product_variants').insert({
      product_id: id,
      color_name: colorName,
      color_hex: v.color_hex || '#000000',
      stock: v.stock || 0,
      photo_url: v.photo_url || null,
      position: i,
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
