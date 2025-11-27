import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'Opportunity Intelligence',
  description: 'Automated business opportunity discovery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
