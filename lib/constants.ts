export const CATEGORIES = [
  'Vénitien',
  'Loup',
  'Colombine',
  'Bauta',
  'Papillon',
  'Intégral',
  'Demi-visage',
  'Plumes',
  'Arlequin',
  'Baroque',
  'Fantôme',
  'Floral',
  'Métallique',
  'Minimaliste',
] as const

export type Category = (typeof CATEGORIES)[number]
