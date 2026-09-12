const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // 1. Prepare Couple Photo (Arch Mask)
  const photoW = 440;
  const photoH = 550;

  // Mask for arch shape
  const maskSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}" viewBox="0 0 ${photoW} ${photoH}">
      <rect x="0" y="0" width="${photoW}" height="${photoH}" rx="220" ry="220" fill="#ffffff" />
      <rect x="0" y="220" width="${photoW}" height="${photoH - 220}" rx="20" ry="20" fill="#ffffff" />
    </svg>
  `);

  const resizedPhoto = await sharp('public/assets/shikha-sumeet.jpg')
    .resize(photoW, photoH, { fit: 'cover', position: 'top' })
    .composite([
      {
        input: maskSvg,
        blend: 'dest-in'
      }
    ])
    .toFormat('png')
    .toBuffer();

  // 2. Base Background & Typography SVG
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fffcf5" />
          <stop offset="40%" stop-color="#f8ede0" />
          <stop offset="100%" stop-color="#f0dcc0" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#c58e30" />
          <stop offset="50%" stop-color="#e9caa0" />
          <stop offset="100%" stop-color="#a46d1b" />
        </linearGradient>
        <linearGradient id="maroon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#841f32" />
          <stop offset="100%" stop-color="#56111e" />
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#482512" flood-opacity="0.22" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" />

      <!-- Ornate outer and inner border -->
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="16" fill="none" stroke="#d5ab62" stroke-width="2" opacity="0.65" />
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="12" fill="none" stroke="#a66e1d" stroke-width="1" opacity="0.4" stroke-dasharray="8,6" />

      <!-- Corner motifs -->
      <g fill="#c58e30" font-size="20">
        <text x="34" y="52">❧</text>
        <text x="${width - 48}" y="52" text-anchor="end">☙</text>
        <text x="34" y="${height - 35}">☙</text>
        <text x="${width - 48}" y="${height - 35}" text-anchor="end">❧</text>
      </g>

      <!-- Left Text Column -->
      <g transform="translate(68, 80)">
        <!-- Invocation -->
        <text x="0" y="0" font-family="Georgia, serif" font-size="13" letter-spacing="4" fill="#a06a1c" font-weight="bold">
          ॥ SHREE GURUVAYURAPPAN THUNAI ॥
        </text>

        <!-- Subheading -->
        <text x="0" y="32" font-family="Georgia, serif" font-size="12" letter-spacing="3" fill="#845330" text-transform="uppercase">
          TOGETHER WITH OUR FAMILIES, WE INVITE YOU TO CELEBRATE
        </text>

        <!-- Main Names -->
        <text x="0" y="96" font-family="Georgia, serif" font-size="44" fill="#4a2412" font-weight="bold">
          Shikha Shaj
        </text>
        <text x="0" y="146" font-family="Georgia, serif" font-size="34" fill="#4a2412" font-weight="bold">
          <tspan fill="#b83850" font-style="italic" font-weight="normal">&amp; </tspan> Sumeet Nandkumar Pillai
        </text>

        <!-- Gold Divider -->
        <line x1="0" y1="178" x2="560" y2="178" stroke="url(#gold)" stroke-width="1.8" />
        <circle cx="280" cy="178" r="5" fill="#a46d1b" />

        <!-- Events Tag -->
        <text x="0" y="222" font-family="Georgia, serif" font-size="14" letter-spacing="3" fill="#882136" font-weight="bold">
          WEDDING CEREMONY (THALIKETTU) &amp; RECEPTION
        </text>

        <!-- Date Badge Box -->
        <g transform="translate(0, 248)">
          <rect width="400" height="52" rx="26" fill="url(#maroon)" />
          <rect x="2" y="2" width="396" height="48" rx="24" fill="none" stroke="#f0d193" stroke-width="1.2" opacity="0.8" />
          <text x="200" y="32" font-family="Georgia, serif" font-size="16" letter-spacing="3" fill="#fff5e4" font-weight="bold" text-anchor="middle">
            SUNDAY · 15 NOVEMBER 2026
          </text>
        </g>

        <!-- Venue Details -->
        <g transform="translate(4, 340)">
          <!-- Temple venue -->
          <circle cx="6" cy="-4" r="4" fill="#c58e30" />
          <text x="22" y="0" font-family="Georgia, serif" font-size="14" fill="#3e2110" font-weight="bold">
            Wedding: Shree Ponnu Guruvayurappan Temple, Dombivli (E)
          </text>
          <text x="22" y="18" font-family="Georgia, serif" font-size="12" fill="#755038">
            Muhurtam: 10:00 AM – 10:30 AM
          </text>

          <!-- Reception venue -->
          <circle cx="6" cy="44" r="4" fill="#841f32" />
          <text x="22" y="48" font-family="Georgia, serif" font-size="14" fill="#3e2110" font-weight="bold">
            Reception: The Atrangii House Sky Lounge, Sanpada, Navi Mumbai
          </text>
          <text x="22" y="66" font-family="Georgia, serif" font-size="12" fill="#755038">
            Monday, 16 November 2026 · 7:00 PM Onwards
          </text>
        </g>

        <!-- Invitation Footer Badge -->
        <g transform="translate(0, 452)">
          <rect width="210" height="30" rx="15" fill="#ebd2a5" opacity="0.8" />
          <text x="105" y="20" font-family="Georgia, serif" font-size="11" letter-spacing="2" fill="#583116" font-weight="bold" text-anchor="middle">
            WEDDING INVITATION
          </text>
        </g>
      </g>

      <!-- Arch Frame Backing & Shadow behind couple photo -->
      <g transform="translate(702, 40)" filter="url(#shadow)">
        <!-- Outer Gold Arch Frame -->
        <path d="
          M 0,220
          A 228,228 0 0,1 456,220
          L 456,548
          A 16,16 0 0,1 440,564
          L 16,564
          A 16,16 0 0,1 0,548
          Z
        " fill="url(#gold)" />
        <!-- Inner white inset -->
        <path d="
          M 6,220
          A 222,222 0 0,1 450,220
          L 450,542
          A 12,12 0 0,1 438,554
          L 18,554
          A 12,12 0 0,1 6,542
          Z
        " fill="#f8ede0" />
      </g>
    </svg>
  `);

  // 3. Composite everything together
  await sharp(svgOverlay)
    .composite([
      {
        input: resizedPhoto,
        top: 48,
        left: 710
      }
    ])
    .png({ quality: 95 })
    .toFile('public/assets/og-shikha-sumeet.png');

  console.log('Successfully generated public/assets/og-shikha-sumeet.png');
}

generateOgImage().catch(console.error);
