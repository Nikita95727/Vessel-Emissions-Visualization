import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vessel Emissions Visualization',
  description: 'Monitor and analyze vessel emissions deviations from Poseidon Principles baselines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 