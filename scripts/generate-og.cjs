const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createCreativeOg() {
  const width = 1200;
  const height = 630;

  // 1. Prepare couple photo in a royal arched frame
  const photoW = 460;
  const photoH = 554;
  const archRadius = 230;

  // Arch clip mask
  const archMaskSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}" viewBox="0 0 ${photoW} ${photoH}">
      <defs>
        <clipPath id="archClip">
          <path d="
            M 0,${archRadius}
            A ${archRadius},${archRadius} 0 0,1 ${photoW},${archRadius}
            L ${photoW},${photoH - 24}
            Q ${photoW},${photoH} ${photoW - 24},${photoH}
            L 24,${photoH}
            Q 0,${photoH} 0,${photoH - 24}
            Z
          " />
        </clipPath>
      </defs>
      <rect width="${photoW}" height="${photoH}" fill="#ffffff" clip-path="url(#archClip)" />
    </svg>
  `);

  // Crop specifically to keep both faces perfectly framed with sky above them
  const maskedPhoto = await sharp('public/assets/shikha-sumeet.jpg')
    .extract({ left: 40, top: 0, width: 670, height: 805 })
    .resize(photoW, photoH, { fit: 'cover' })
    .composite([
      {
        input: archMaskSvg,
        blend: 'dest-in'
      }
    ])
    .toFormat('png')
    .toBuffer();

  // 2. Build SVG overlay with rich royal wedding aesthetics
  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffdf8" />
          <stop offset="45%" stop-color="#fcf5e8" />
          <stop offset="100%" stop-color="#f4e5cb" />
        </linearGradient>

        <!-- Pure Gold Metallic Gradient -->
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#be8225" />
          <stop offset="25%" stop-color="#f7e1a6" />
          <stop offset="50%" stop-color="#c69135" />
          <stop offset="75%" stop-color="#f3d88e" />
          <stop offset="100%" stop-color="#996317" />
        </linearGradient>

        <!-- Royal Maroon Gradient -->
        <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7e172a" />
          <stop offset="50%" stop-color="#641120" />
          <stop offset="100%" stop-color="#460a15" />
        </linearGradient>

        <!-- Soft Warm Drop Shadow -->
        <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#421a08" flood-opacity="0.25" />
        </filter>

        <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#c99538" flood-opacity="0.3" />
        </filter>
      </defs>

      <!-- Background Canvas -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Subtle Decorative Mandala Watermark on Left -->
      <g opacity="0.045" stroke="#7e172a" stroke-width="2" fill="none" transform="translate(190, 315)">
        <circle r="220" />
        <circle r="180" stroke-dasharray="6,6" />
        <circle r="140" />
        <circle r="100" />
        <circle r="60" />
        <circle r="20" />
        ${Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 220 * Math.cos(angle);
          const y = 220 * Math.sin(angle);
          return `<line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
        }).join('')}
      </g>

      <!-- Outer Luxury Gold & Maroon Borders -->
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="18" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" />
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="14" fill="none" stroke="#7e172a" stroke-width="1.2" opacity="0.35" stroke-dasharray="10,6" />

      <!-- Ornate Corner Motifs -->
      <g fill="url(#goldGrad)" font-size="24" font-family="serif">
        <text x="36" y="54">❦</text>
        <text x="${width - 52}" y="54" text-anchor="end">❧</text>
        <text x="36" y="${height - 34}">❧</text>
        <text x="${width - 52}" y="${height - 34}" text-anchor="end">❦</text>
      </g>

      <!-- LEFT SIDE: COUPLE DETAILS & INVITATION TYPOGRAPHY -->
      <g transform="translate(68, 68)">
        
        <!-- Sacred Invocation Header -->
        <g>
          <text x="0" y="16" font-family="'Times New Roman', Georgia, serif" font-size="13.5" letter-spacing="4" fill="#a46d1b" font-weight="bold">
            ॥ SHREE GURUVAYURAPPAN THUNAI ॥
          </text>
          <text x="0" y="44" font-family="Georgia, serif" font-size="12" letter-spacing="3" fill="#845330" text-transform="uppercase" font-weight="600">
            TOGETHER WITH THEIR FAMILIES
          </text>
        </g>

        <!-- COUPLE NAMES: GROOM FIRST, THEN BRIDE -->
        <g transform="translate(0, 102)">
          <!-- Groom -->
          <text x="0" y="0" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-size="44" fill="#3c150c" font-weight="800" letter-spacing="0.5">
            Sumeet Nandkumar
          </text>
          
          <!-- Ampersand & Bride -->
          <g transform="translate(0, 52)">
            <text x="4" y="0" font-family="'Playfair Display', Georgia, serif" font-size="34" font-style="italic" fill="#881f33" font-weight="600">
              &amp;
            </text>
            <text x="40" y="-1" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-size="44" fill="#3c150c" font-weight="800" letter-spacing="0.5">
              Shikha Shaj
            </text>
          </g>
        </g>

        <!-- Royal Gold Divider with Lotus Medallion -->
        <g transform="translate(0, 185)">
          <line x1="0" y1="0" x2="250" y2="0" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="270" cy="0" r="7" fill="#b9822a" />
          <circle cx="270" cy="0" r="4" fill="#fdf4e2" />
          <circle cx="270" cy="0" r="2" fill="#7e172a" />
          <line x1="290" y1="0" x2="540" y2="0" stroke="url(#goldGrad)" stroke-width="2" />
        </g>

        <!-- Event Sub-title -->
        <text x="0" y="222" font-family="Georgia, serif" font-size="13" letter-spacing="3.5" fill="#7e172a" font-weight="bold">
          CORDIALLY INVITE YOU TO CELEBRATE THEIR WEDDING
        </text>

        <!-- Auspicious Date Badge (Maroon Ribbon Pill with Gold Emboss) -->
        <g transform="translate(0, 246)" filter="url(#subtleGlow)">
          <rect width="420" height="52" rx="26" fill="url(#maroonGrad)" />
          <rect x="2.5" y="2.5" width="415" height="47" rx="23.5" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" />
          <!-- Diamond Accents inside pill -->
          <text x="32" y="32" fill="#f3dfb2" font-size="14">✦</text>
          <text x="210" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16.5" letter-spacing="2.5" fill="#fff9ee" font-weight="bold" text-anchor="middle">
            SUNDAY · 15 NOVEMBER 2026
          </text>
          <text x="388" y="32" fill="#f3dfb2" font-size="14">✦</text>
        </g>

        <!-- Venues & Timings Block -->
        <g transform="translate(2, 336)">
          <!-- Ceremony -->
          <g>
            <circle cx="6" cy="-5" r="5" fill="#a46d1b" />
            <text x="24" y="0" font-family="Georgia, serif" font-size="14.5" fill="#2d120a" font-weight="bold">
              Wedding (Thalikettu): Shree Ponnu Guruvayurappan Temple, Dombivli
            </text>
            <text x="24" y="20" font-family="Georgia, serif" font-size="12.5" fill="#6d472c">
              Muhurtam: 10:00 AM – 10:30 AM
            </text>
          </g>

          <!-- Reception -->
          <g transform="translate(0, 48)">
            <circle cx="6" cy="-5" r="5" fill="#7e172a" />
            <text x="24" y="0" font-family="Georgia, serif" font-size="14.5" fill="#2d120a" font-weight="bold">
              Reception: The Atrangii House Sky Lounge, Sanpada, Navi Mumbai
            </text>
            <text x="24" y="20" font-family="Georgia, serif" font-size="12.5" fill="#6d472c">
              Monday, 16 November 2026 · 7:00 PM Onwards
            </text>
          </g>
        </g>

        <!-- Wedding Invitation Golden Wax Seal Badge -->
        <g transform="translate(0, 448)">
          <rect width="210" height="32" rx="16" fill="#eed9b3" stroke="url(#goldGrad)" stroke-width="1.2" />
          <text x="105" y="21" font-family="Georgia, serif" font-size="11.5" letter-spacing="2.5" fill="#542b0e" font-weight="bold" text-anchor="middle">
            WEDDING INVITATION
          </text>
        </g>

      </g>

      <!-- RIGHT SIDE: ROYAL ARCHED PHOTO FRAME -->
      <g transform="translate(684, 38)" filter="url(#cardShadow)">
        <!-- Outer Gold Rim -->
        <path d="
          M 0,${archRadius + 14}
          A ${archRadius + 14},${archRadius + 14} 0 0,1 ${photoW + 28},${archRadius + 14}
          L ${photoW + 28},${photoH + 28 - 24}
          Q ${photoW + 28},${photoH + 28} ${photoW + 28 - 24},${photoH + 28}
          L 24,${photoH + 28}
          Q 0,${photoH + 28} 0,${photoH + 28 - 24}
          Z
        " fill="url(#goldGrad)" />

        <!-- Inner Parchment Mount Rim -->
        <path d="
          M 6,${archRadius + 14}
          A ${archRadius + 8},${archRadius + 8} 0 0,1 ${photoW + 22},${archRadius + 14}
          L ${photoW + 22},${photoH + 22 - 24}
          Q ${photoW + 22},${photoH + 22} ${photoW + 22 - 24},${photoH + 22}
          L 24,${photoH + 22}
          Q 6,${photoH + 22} 6,${photoH + 22 - 24}
          Z
        " fill="#fcf6ec" />

        <!-- Maroon Pin-Stripe Rim -->
        <path d="
          M 10,${archRadius + 14}
          A ${archRadius + 4},${archRadius + 4} 0 0,1 ${photoW + 18},${archRadius + 14}
          L ${photoW + 18},${photoH + 18 - 24}
          Q ${photoW + 18},${photoH + 18} ${photoW + 18 - 24},${photoH + 18}
          L 24,${photoH + 18}
          Q 10,${photoH + 18} 10,${photoH + 18 - 24}
          Z
        " fill="none" stroke="#7e172a" stroke-width="1" opacity="0.6" stroke-dasharray="6,4" />
      </g>
    </svg>
  `;

  // 3. Composite everything together
  const svgOverlayBuffer = Buffer.from(svgContent);

  const finalImage = await sharp(svgOverlayBuffer)
    .composite([
      {
        input: maskedPhoto,
        top: 52,
        left: 698
      }
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  // Save to public assets
  fs.writeFileSync('public/assets/og-sumeet-shikha.png', finalImage);
  fs.writeFileSync('public/assets/og-shikha-sumeet.png', finalImage);
  
  // Clean up test crop if exists
  if (fs.existsSync('public/assets/test-crop.jpg')) {
    fs.unlinkSync('public/assets/test-crop.jpg');
  }

  // Also copy to dist if dist exists
  if (fs.existsSync('dist/assets')) {
    fs.writeFileSync('dist/assets/og-sumeet-shikha.png', finalImage);
    fs.writeFileSync('dist/assets/og-shikha-sumeet.png', finalImage);
  }

  console.log('Successfully generated creative couple OG images at:');
  console.log('- public/assets/og-sumeet-shikha.png');
  console.log('- public/assets/og-shikha-sumeet.png');
}

createCreativeOg().catch(err => {
  console.error('Error generating OG image:', err);
  process.exit(1);
});
