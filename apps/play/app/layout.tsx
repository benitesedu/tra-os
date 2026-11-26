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
  title: 'TRAÇOS — Nem tudo precisa estar desenhado.',
  description: 'Um novo desafio por dia.',
  alternates: {
    languages: {
      'pt-BR': siteUrl,
      'en-US': `${siteUrl}/?lang=en`,
      'es-ES': `${siteUrl}/?lang=es`,
    },
  },
  openGraph: {
    title: 'TRAÇOS — Nem tudo precisa estar desenhado.',
    description: 'Um novo desafio por dia.',
    url: siteUrl,
    siteName: 'TRAÇOS',
    locale: 'pt_BR',
    alternateLocale: ['en_US', 'es_ES'],
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, type: 'image/png', alt: 'TRAÇOS — Nem tudo precisa estar desenhado. Um novo desafio por dia.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRAÇOS — Nem tudo precisa estar desenhado.',
    description: 'Um novo desafio por dia.',
    images: [ogImage],
  },
};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
