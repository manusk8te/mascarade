'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, type Category } from '@/lib/constants'
import type { Product, ProductVariant } from '@/lib/types'
import Link from 'next/link'

interface VariantForm {
  id?: string
  color_name: string
  color_hex: string
  stock: number
  photo_file: File | null
  preview_url: string | null
  existing_photo_url: string | null
}

const emptyVariant = (): VariantForm => ({
  color_name: '',
  color_hex: '#000000',
  stock: 0,
  photo_file: null,
  preview_url: null,
  existing_photo_url: null,
})

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [isPublished, setIsPublished] = useState(false)
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant()])

  useEffect(() => {
    async function fetchProduct() {
      const [pRes, vRes] = await Promise.all([
        fetch(`/api/admin/products/${id}`),
        fetch(`/api/admin/products/${id}/variants`),
      ])
      const product: Product = await pRes.json()
      const fetchedVariants: ProductVariant[] = await vRes.json()

      if (!product?.id) { setLoading(false); return }

      setName(product.name)
      setDescription(product.description || '')
      setPrice(String(product.price))
      setCategory(product.category)
      setIsPublished(product.is_published)

      if (fetchedVariants.length > 0) {
        setVariants(fetchedVariants.map(v => ({
          id: v.id,
          color_name: v.color_name,
          color_hex: v.color_hex,
          stock: v.stock,
          photo_file: null,
          preview_url: v.photo_url,
          existing_photo_url: v.photo_url,
        })))
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const updateVariant = (index: number, field: keyof VariantForm, value: unknown) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const handlePhotoChange = (index: number, file: File | null) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, photo_file: file, preview_url: url } : v
      )
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Upload any new photos first
      const variantsWithUrls = await Promise.all(
        variants.map(async (v, i) => {
          let photo_url = v.existing_photo_url
          if (v.photo_file) {
            const ext = v.photo_file.name.split('.').pop()
            const filename = `${Date.now()}-${i}.${ext}`
            const fd = new FormData()
            fd.append('file', v.photo_file)
            fd.append('filename', filename)
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
            const json = await res.json()
            photo_url = json.url || photo_url
          }
          return { ...v, color_name: v.color_name || 'Principal', photo_url }
        })
      )

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          price: parseFloat(price),
          category,
          is_published: isPublished,
          variants: variantsWithUrls,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(`Erreur : ${json.error}`)
        setSaving(false)
        return
      }

      router.push('/admin/products')
    } catch (err) {
      setError(`Erreur inattendue : ${err instanceof Error ? err.message : String(err)}`)
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '0.5px solid #E5E5E5',
    padding: '10px 12px',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 300,
    fontSize: '0.85rem',
    color: '#000',
    backgroundColor: '#FFF',
    outline: 'none',
    borderRadius: 0,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 300,
    fontSize: '0.55rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#999',
    marginBottom: '6px',
    display: 'block',
  }

  if (loading) {
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
        Chargement…
      </div>
    )
  }

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
          href="/admin/products"
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
          Modifier : {name}
        </h1>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Basic info */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nom du produit *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <label style={labelStyle}>Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                required
                style={inputStyle}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Publish toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: isPublished ? '#000' : '#E5E5E5',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: isPublished ? '20px' : '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  transition: 'left 0.2s ease',
                }}
              />
            </button>
            <span
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                color: '#000',
                cursor: 'pointer',
              }}
              onClick={() => setIsPublished(!isPublished)}
            >
              {isPublished ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </section>

        {/* Variants */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#000',
                margin: 0,
              }}
            >
              Couleurs (max 3)
            </h2>
            {variants.length < 3 && (
              <button
                type="button"
                onClick={() => setVariants([...variants, emptyVariant()])}
                style={{
                  background: 'none',
                  border: '0.5px solid #000',
                  padding: '6px 14px',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.55rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#000',
                  cursor: 'pointer',
                }}
              >
                + Ajouter une couleur
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {variants.map((variant, index) => (
              <div
                key={index}
                style={{
                  border: '0.5px solid #E5E5E5',
                  padding: '24px',
                  position: 'relative',
                }}
              >
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setVariants(variants.filter((_, i) => i !== index))
                    }
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.55rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#999',
                    }}
                  >
                    Retirer
                  </button>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <label style={labelStyle}>Couleur</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={variant.color_hex}
                        onChange={(e) =>
                          updateVariant(index, 'color_hex', e.target.value)
                        }
                        style={{
                          width: '40px',
                          height: '36px',
                          border: '0.5px solid #E5E5E5',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontWeight: 300,
                          fontSize: '0.65rem',
                          color: '#999',
                        }}
                      >
                        {variant.color_hex.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Nom de la couleur</label>
                    <input
                      type="text"
                      value={variant.color_name}
                      onChange={(e) =>
                        updateVariant(index, 'color_name', e.target.value)
                      }
                      style={inputStyle}
                      placeholder="Ivoire"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, 'stock', parseInt(e.target.value) || 0)
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Photo */}
                <div>
                  <label style={labelStyle}>Photo</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {variant.preview_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={variant.preview_url}
                        alt="Prévisualisation"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          border: '0.5px solid #E5E5E5',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handlePhotoChange(index, e.target.files?.[0] || null)
                      }
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.7rem',
                        color: '#999',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '0.7rem',
              color: '#cc0000',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: saving ? '#999' : '#000',
            color: '#FFF',
            border: '0.5px solid #000',
            padding: '14px 0',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: saving ? 'wait' : 'pointer',
            width: '200px',
          }}
        >
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}
