import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Providers } from './providers'
import { cn } from '@/lib/utils/cn'
import { Toaster } from '@/components/ui/sonner'
import { SITE, SITE_URL } from '@/config/site'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: SITE.titleTemplate,
    default: SITE.homeTitle,
  },
  description: SITE.description,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: SITE.homeTitle,
    description: SITE.description,
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE_URL,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.homeTitle,
    description: SITE.description,
    images: [SITE.defaultOgImage],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.variable, poppins.variable, "font-sans antialiased")}>
        <OrganizationJsonLd />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}