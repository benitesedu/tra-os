import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync('apps/play/public/logo.svg', 'utf8').match(/<g[\s\S]*<\/g>/)?.[0];

if (!logo) throw new Error('Original logo group not found');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#11151D"/>
  <g fill="none" stroke="#79C8A3" stroke-width="1" opacity="0.12">
    <circle cx="104" cy="102" r="68"/>
    <circle cx="1090" cy="512" r="92"/>
    <path d="M0 500L220 280L390 450L575 265L780 470L1000 250L1200 420"/>
    <path d="M92 580H1108" stroke-dasharray="5 12"/>
  </g>
  <g fill="#F4F4F5" opacity="0.5">
    <circle cx="100" cy="530" r="2"/>
    <circle cx="1090" cy="104" r="2"/>
    <circle cx="1040" cy="150" r="1.5"/>
  </g>
  <g transform="translate(510 56)">${logo}</g>
  <text x="600" y="238" text-anchor="middle" fill="#F4F4F5" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="14">TRAÇOS</text>
  <rect x="560" y="270" width="80" height="2" rx="1" fill="#79C8A3"/>
  <text x="600" y="374" text-anchor="middle" fill="#F4F4F5" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="600">Nem tudo precisa estar desenhado.</text>
  <text x="600" y="423" text-anchor="middle" fill="#79C8A3" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500">Um novo desafio por dia.</text>
  <text x="600" y="564" text-anchor="middle" fill="#F4F4F5" opacity="0.45" font-family="Inter, Arial, sans-serif" font-size="14" letter-spacing="4">OBSERVE · IMAGINE · DESCUBRA</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('apps/play/public/og-image.png');
