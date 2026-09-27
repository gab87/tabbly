// Generates placeholder PWA icons (indigo background + Lucide "Utensils" glyph)
// Run with: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
mkdirSync(publicDir, { recursive: true });

const BG_COLOR = '#4f46e5';

// Lucide "Utensils" icon path data (24x24 viewBox, stroke-based)
const UTENSILS_PATHS = `
  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
  <path d="M7 2v20" />
  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
`;

function buildSvg({ size, rounded, iconRatio }) {
  const radius = rounded ? size * 0.2 : 0;
  const iconSize = size * iconRatio;
  const scale = iconSize / 24;
  const offset = (size - iconSize) / 2;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="${BG_COLOR}" />
  <g transform="translate(${offset}, ${offset}) scale(${scale})"
     fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    ${UTENSILS_PATHS}
  </g>
</svg>`;
}

async function generate(name, size, { rounded, iconRatio }) {
  const svg = buildSvg({ size, rounded, iconRatio });
  await sharp(Buffer.from(svg)).png().toFile(join(publicDir, name));
  console.log(`Generated ${name}`);
}

async function main() {
  // Regular ("any" purpose) icons: rounded background, icon fills most of the canvas
  await generate('pwa-192x192.png', 192, { rounded: true, iconRatio: 0.6 });
  await generate('pwa-512x512.png', 512, { rounded: true, iconRatio: 0.6 });

  // Maskable icon: full-bleed square background, icon within the ~80% "safe zone"
  await generate('pwa-maskable-512x512.png', 512, { rounded: false, iconRatio: 0.5 });

  // Apple touch icon: iOS applies its own rounding, so full-bleed square background
  await generate('apple-touch-icon.png', 180, { rounded: false, iconRatio: 0.55 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
