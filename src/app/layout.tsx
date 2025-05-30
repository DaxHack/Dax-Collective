import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer
import InteractiveEffects from '@/components/InteractiveEffects'; // Import InteractiveEffects

export const metadata: Metadata = {
  title: 'Dax Collective | Creativity Without Boundaries',
  description: 'Dax Collective unifies travel content, creative products, tech development, and anime content under one cohesive brand.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Header /> {/* Add Header */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer /> {/* Add Footer */}
        <InteractiveEffects /> {/* Add InteractiveEffects */}
      </body>
    </html>
  )
}
