export const CATEGORIES = [
  'Vénitien Filigrane',
  'Romain / Gladiateur',
  'Colombine Classique',
  'Visage Complet / Volto',
  'Plumes & Joyaux',
  'Bauta / Fantôme',
  'Couronne de Laurier',
] as const

export type Category = (typeof CATEGORIES)[number]
