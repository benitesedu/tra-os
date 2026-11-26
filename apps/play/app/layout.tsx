import type { Metadata } from 'next';
import './style.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://gametraits.vercel.app').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Traços — O desafio diário dos traços',
  description: 'Observe. Imagine. Descubra. Você consegue desvendar o desenho de hoje?',
  alternates: {
    languages: {
      'pt-BR': siteUrl,
      'en-US': `${siteUrl}/?lang=en`,
      'es-ES': `${siteUrl}/?lang=es`,
    },
  },
  openGraph: {
    title: 'Traços — O desafio diário dos traços',
    description: 'Observe. Imagine. Descubra. Você consegue desvendar o desenho de hoje?',
    url: siteUrl,
    siteName: 'TRAÇOS',
    locale: 'pt_BR',
    alternateLocale: ['en_US', 'es_ES'],
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, type: 'image/png', alt: 'Traços — O desafio diário dos traços.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traços — O desafio diário dos traços',
    description: 'Observe. Imagine. Descubra. Você consegue desvendar o desenho de hoje?',
    images: [ogImage],
  },
};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
