import { Analytics } from '@vercel/analytics/next'
import { Inter, Instrument_Serif } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-instrument', weight: '400' })

export const metadata: Metadata = {
  title: 'Leela Prasad — AI & Full Stack Developer',
  description: 'Leela Prasad is a full stack developer and data scientist building intelligent products across AI, modern web development, and cloud systems.',
  generator: 'Next.js',
  openGraph: {
    title: 'Leela Prasad — AI & Full Stack Developer',
    description: 'Building intelligent products at the intersection of full-stack engineering, AI, and modern web development.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leela Prasad — AI & Full Stack Developer',
    description: 'AI, full-stack, and web platform engineering.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
