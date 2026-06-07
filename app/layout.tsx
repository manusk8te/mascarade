import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'Mascarade — Masques de bal',
  description:
    'Collection de masques de bal et mascarade. 14 styles, plusieurs coloris. Design épuré.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
      </body>
    </html>
  )
}
