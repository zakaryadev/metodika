import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const CWD = process.cwd();
const NAQSH_PATH = path.join(CWD, "public", "naqsh.png");

async function createBaseIcon(size, radiusPercent = 0.22, naqshScale = 0.82) {
  const rx = Math.round(size * radiusPercent);
  const svgBg = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3f6ae6" />
          <stop offset="100%" stop-color="#1d3bad" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${rx}" fill="url(#brandGrad)" />
    </svg>
  `);

  const naqshSize = Math.round(size * naqshScale);
  const naqshBuffer = await sharp(NAQSH_PATH)
    .resize(naqshSize, naqshSize, { kernel: "lanczos3" })
    .toBuffer();

  const offset = Math.round((size - naqshSize) / 2);

  return sharp(svgBg)
    .composite([{ input: naqshBuffer, top: offset, left: offset }])
    .png()
    .toBuffer();
}

/**
 * Builds a multi-resolution ICO file containing embedded PNGs
 */
function buildIco(pngBuffers, sizes) {
  const headerLen = 6;
  const dirEntryLen = 16;
  const numImages = sizes.length;
  let offset = headerLen + dirEntryLen * numImages;

  const header = Buffer.alloc(headerLen);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = 1 (icon)
  header.writeUInt16LE(numImages, 4); // count

  const entries = [];
  for (let i = 0; i < numImages; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(dirEntryLen);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  console.log("Generating favicons from naqsh.png...");

  // 1. High-res master icon (512x512)
  const icon512 = await createBaseIcon(512, 0.22, 0.82);
  fs.writeFileSync(path.join(CWD, "src", "app", "icon.png"), icon512);
  fs.writeFileSync(path.join(CWD, "public", "icon.png"), icon512);
  fs.writeFileSync(path.join(CWD, "public", "icon-512.png"), icon512);

  // 2. 192x192 icon for PWA/manifest
  const icon192 = await sharp(icon512).resize(192, 192, { kernel: "lanczos3" }).png().toBuffer();
  fs.writeFileSync(path.join(CWD, "public", "icon-192.png"), icon192);

  // 3. Apple touch icon (180x180)
  const appleIcon = await sharp(icon512).resize(180, 180, { kernel: "lanczos3" }).png().toBuffer();
  fs.writeFileSync(path.join(CWD, "src", "app", "apple-icon.png"), appleIcon);
  fs.writeFileSync(path.join(CWD, "public", "apple-icon.png"), appleIcon);

  // 4. Standalone PNG favicons (32x32 and 16x16)
  const icon32 = await sharp(icon512).resize(32, 32, { kernel: "lanczos3" }).png().toBuffer();
  const icon16 = await sharp(icon512).resize(16, 16, { kernel: "lanczos3" }).png().toBuffer();
  const icon48 = await sharp(icon512).resize(48, 48, { kernel: "lanczos3" }).png().toBuffer();

  fs.writeFileSync(path.join(CWD, "public", "favicon-32x32.png"), icon32);
  fs.writeFileSync(path.join(CWD, "public", "favicon-16x16.png"), icon16);

  // 5. Multi-size favicon.ico (16, 32, 48)
  const ico = buildIco([icon16, icon32, icon48], [16, 32, 48]);
  fs.writeFileSync(path.join(CWD, "src", "app", "favicon.ico"), ico);
  fs.writeFileSync(path.join(CWD, "public", "favicon.ico"), ico);

  console.log("All favicons successfully generated!");
}

main().catch((err) => {
  console.error("Failed to generate favicons:", err);
  process.exit(1);
});
