import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'PREDA Suite v2', description: 'Suite Integral de Gestión del Talento' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>
}
