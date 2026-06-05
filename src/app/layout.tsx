import type { Metadata, Viewport } from 'next'
import { Caveat, Quicksand } from 'next/font/google'
import './globals.css'

const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', display: 'swap' })

export const metadata: Metadata = {
  title: 'Family Tree',
  description: 'Our shared family history',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${caveat.variable} font-body antialiased`}>{children}</body>
    </html>
  )
}
