import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .select('*')
    .eq('product_id', params.id)
    .order('position', { ascending: true })

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data || [])
}
