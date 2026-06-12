import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Lire les variables depuis .env.local
function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const [k, ...v] = line.split('=')
      if (k && v.length) process.env[k.trim()] = v.join('=').trim()
    }
  } catch {}
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const DOWNLOADS = '/Users/goblyemmanuel/Downloads'
const BUCKET = 'product-photos'

const products = [
  {
    name: 'Vénitien Filigrane Arabesque',
    category: 'Vénitien Filigrane',
    price: 10000,
    description: 'Masque en métal découpé au laser avec arabesques ouvertes et volutes complexes. Inspiré de la tradition vénitienne du Carnaval, il allie légèreté et sophistication.',
    variants: [
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06.jpeg', storagePath: 'venitien-arabesque-argent.jpeg', stock: 6, position: 0 },
      { color: 'Or',     hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.07 (2).jpeg', storagePath: 'venitien-arabesque-or.jpeg', stock: 6, position: 1 },
    ],
  },
  {
    name: 'Vénitien Filigrane Couronne',
    category: 'Vénitien Filigrane',
    price: 10000,
    description: 'Masque en métal découpé au laser avec arabesques ouvertes et sommets en forme de couronne. Théâtral et ornemental.',
    variants: [
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.07 (4).jpeg', storagePath: 'venitien-couronne-argent.jpeg', stock: 5, position: 0 },
      { color: 'Or',     hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.07.jpeg',      storagePath: 'venitien-couronne-or.jpeg',    stock: 5, position: 1 },
    ],
  },
  {
    name: 'Romain Gladiateur Losange',
    category: 'Romain / Gladiateur',
    price: 10000,
    description: 'Masque moulé solide avec motifs en relief et gravures en losange. Inspiré de l\'esthétique des armures de la Rome antique.',
    variants: [
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06 (3).jpeg', storagePath: 'romain-losange-argent.jpeg', stock: 6, position: 0 },
      { color: 'Or',     hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.08 (1).jpeg', storagePath: 'romain-losange-or.jpeg',    stock: 6, position: 1 },
    ],
  },
  {
    name: 'Romain Gladiateur Arabesques',
    category: 'Romain / Gladiateur',
    price: 10000,
    description: 'Masque moulé solide avec arabesques gravées et couronne. Évoque la puissance des guerriers romains.',
    variants: [
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.08.jpeg',      storagePath: 'romain-arabesques-argent.jpeg', stock: 6, position: 0 },
      { color: 'Or',     hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.08 (3).jpeg', storagePath: 'romain-arabesques-or.jpeg',    stock: 1, position: 1 },
    ],
  },
  {
    name: 'Colombine Classique I',
    category: 'Colombine Classique',
    price: 10000,
    description: 'Demi-masque polyvalent avec finition métallique brossée et couronnet. L\'un des designs les plus anciens de la tradition vénitienne.',
    variants: [
      { color: 'Or',   hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.05 (3).jpeg', storagePath: 'colombine-I-or.jpeg',   stock: 6, position: 0 },
      { color: 'Gris', hex: '#6B6B6B', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06 (5).jpeg', storagePath: 'colombine-I-gris.jpeg', stock: 6, position: 1 },
    ],
  },
  {
    name: 'Colombine Classique II',
    category: 'Colombine Classique',
    price: 10000,
    description: 'Demi-masque minimaliste avec finition métallique brossée. Simple, élégant et intemporel.',
    variants: [
      { color: 'Gris',   hex: '#6B6B6B', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.07 (1).jpeg', storagePath: 'colombine-II-gris.jpeg',   stock: 11, position: 0 },
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.07 (3).jpeg', storagePath: 'colombine-II-argent.jpeg', stock: 11, position: 1 },
    ],
  },
  {
    name: 'Visage Complet / Volto',
    category: 'Visage Complet / Volto',
    price: 10000,
    description: 'Masque couvrant l\'intégralité du visage, fidèle à la tradition du Carnaval de Venise. Mystérieux et envoûtant.',
    variants: [
      { color: 'Gris', hex: '#6B6B6B', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06 (1).jpeg', storagePath: 'volto-gris.jpeg', stock: 5, position: 0 },
      { color: 'Or',   hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06 (4).jpeg', storagePath: 'volto-or.jpeg',   stock: 4, position: 1 },
    ],
  },
  {
    name: 'Plumes & Joyaux',
    category: 'Plumes & Joyaux',
    price: 10000,
    description: 'Masque glamour orné de plumes, sequins et cristaux. Le style le plus féminin et sophistiqué de la collection.',
    variants: [
      { color: 'Noir',   hex: '#1C1C1C', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.05.jpeg',      storagePath: 'plumes-noir.jpeg',   stock: 10, position: 0 },
      { color: 'Argent', hex: '#A8A9AD', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.06 (2).jpeg', storagePath: 'plumes-argent.jpeg', stock: 8,  position: 1 },
    ],
  },
  {
    name: 'Bauta / Fantôme',
    category: 'Bauta / Fantôme',
    price: 10000,
    description: 'Masque lisse d\'un noir mat avec une forme légèrement angulaire. Simple, élégant et résolument mystérieux.',
    variants: [
      { color: 'Noir', hex: '#1C1C1C', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.05 (1).jpeg', storagePath: 'bauta-noir.jpeg', stock: 10, position: 0 },
    ],
  },
  {
    name: 'Couronne de Laurier',
    category: 'Couronne de Laurier',
    price: 10000,
    description: 'Demi-masque royal orné d\'un motif de couronne et de feuilles en relief. Alliance de royauté et de guerrier antique.',
    variants: [
      { color: 'Gris', hex: '#6B6B6B', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.05 (2).jpeg', storagePath: 'couronne-gris.jpeg', stock: 6, position: 0 },
      { color: 'Or',   hex: '#C9A849', srcFile: 'WhatsApp Image 2026-06-10 at 18.22.08 (2).jpeg', storagePath: 'couronne-or.jpeg',   stock: 6, position: 1 },
    ],
  },
]

async function main() {
  console.log('🗑  Suppression des anciens produits...')
  const { data: existing } = await supabase.from('products').select('id')
  if (existing && existing.length > 0) {
    const ids = existing.map((p) => p.id)
    await supabase.from('product_variants').delete().in('product_id', ids)
    await supabase.from('products').delete().in('id', ids)
    console.log(`   ✓ ${ids.length} produit(s) supprimé(s)`)
  }

  console.log('\n📸 Upload des photos + création des produits...\n')

  for (const product of products) {
    console.log(`→ ${product.name}`)

    const variantUrls = []
    for (const v of product.variants) {
      const filePath = join(DOWNLOADS, v.srcFile)
      const fileBuffer = readFileSync(filePath)

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(v.storagePath, fileBuffer, { contentType: 'image/jpeg', upsert: true })

      if (uploadErr) {
        console.error(`   ✗ Upload échoué pour ${v.storagePath}: ${uploadErr.message}`)
        variantUrls.push(null)
      } else {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(v.storagePath)
        variantUrls.push(urlData.publicUrl)
        console.log(`   ✓ ${v.color} uploadé`)
      }
    }

    const { data: newProduct, error: productErr } = await supabase
      .from('products')
      .insert({ name: product.name, category: product.category, price: product.price, description: product.description, is_published: true })
      .select('id')
      .single()

    if (productErr) {
      console.error(`   ✗ Produit non créé: ${productErr.message}`)
      continue
    }

    const variantsToInsert = product.variants.map((v, i) => ({
      product_id: newProduct.id,
      color_name: v.color,
      color_hex: v.hex,
      photo_url: variantUrls[i],
      stock: v.stock,
      position: v.position,
    }))

    const { error: variantErr } = await supabase.from('product_variants').insert(variantsToInsert)

    if (variantErr) {
      console.error(`   ✗ Variantes non créées: ${variantErr.message}`)
    } else {
      console.log(`   ✓ ${product.variants.length} variante(s) créée(s)\n`)
    }
  }

  console.log('✅ Terminé !')
}

main().catch(console.error)
