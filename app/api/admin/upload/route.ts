import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const filename = formData.get('filename') as string

  if (!file || !filename) {
    return NextResponse.json({ error: 'Missing file or filename' }, { status: 400 })
  }

  // Ensure bucket exists
  await supabaseAdmin.storage.createBucket('product-photos', { public: true }).catch(() => {})

  const buffer = Buffer.from(await file.arrayBuffer())
  const { data, error } = await supabaseAdmin.storage
    .from('product-photos')
    .upload(filename, buffer, { upsert: true, contentType: file.type })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('product-photos')
    .getPublicUrl(filename)

  return NextResponse.json({ url: urlData.publicUrl })
}
