export const CATEGORIES = [
  'Venetian Filigree / Laser-Cut Metal',
  'Roman / Gladiator Style',
  'Classic Colombina',
  'Full-Face / Volto',
  'Feathered / Decorated',
  'Bauta-Inspired / Phantom Style',
  'Laurel / Warrior Crown',
] as const

export type Category = (typeof CATEGORIES)[number]
