import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supix — AI control center',
  description: 'A secure workspace for BYOK models, MCP tools, and agent workflows.',
  generator: 'Supix',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#111217',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
