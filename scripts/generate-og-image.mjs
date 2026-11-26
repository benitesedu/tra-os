import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync('apps/play/public/logo.svg', 'utf8').match(/<g[\s\S]*<\/g>/)?.[0];

if (!logo) throw new Error('Original logo group not found');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#11151D"/>
  <rect x="10" y="10" width="1180" height="610" rx="18" fill="none" stroke="#79C8A3" stroke-width="10"/>
  <g fill="none" stroke="#79C8A3" stroke-width="1.4" opacity="0.18">
    <circle cx="600" cy="235" r="148"/>
    <circle cx="600" cy="235" r="190"/>
    <path d="M18 26L245 410L470 26L700 410L930 26L1182 410"/>
    <path d="M18 410L245 26L470 410L700 26L930 410L1182 26"/>
  </g>
  <g fill="#F4F4F5" opacity="0.5">
    <circle cx="80" cy="540" r="2"/>
    <circle cx="1110" cy="94" r="2"/>
    <circle cx="1060" cy="150" r="1.5"/>
  </g>
  <g transform="translate(510 52) scale(1.05)">${logo}</g>
  <text x="600" y="247" text-anchor="middle" fill="#F4F4F5" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="600" letter-spacing="15">TRAÇOS</text>
  <text x="600" y="335" text-anchor="middle" fill="#F4F4F5" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="600">Nem tudo precisa estar desenhado.</text>
  <rect x="427" y="365" width="346" height="48" rx="24" fill="#79C8A3" fill-opacity="0.14"/>
  <text x="600" y="396" text-anchor="middle" fill="#79C8A3" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="500" letter-spacing="2">UM NOVO DESAFIO POR DIA</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('apps/play/public/og-image.png');
