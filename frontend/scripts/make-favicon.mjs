import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static favicon SVG: the mascot dog's head/face, cropped tight and centered
// on a square canvas that matches the site's stone-paper background.
const svg = `
<svg width="256" height="256" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="#efede6"/>

  <!-- ears -->
  <path d="M14 14 L26 28 L17 32 Z" fill="#c97a25"/>
  <path d="M50 14 L38 28 L47 32 Z" fill="#c97a25"/>

  <!-- head -->
  <circle cx="32" cy="32" r="19" fill="#e2963c"/>

  <!-- headphone band -->
  <path d="M16 23 A16 16 0 0 1 48 23" stroke="#2b2b2b" stroke-width="3.2" fill="none"/>
  <circle cx="16" cy="27" r="5" fill="#2b2b2b"/>
  <circle cx="48" cy="27" r="5" fill="#2b2b2b"/>

  <!-- snout -->
  <ellipse cx="32" cy="38" rx="9.5" ry="7" fill="#f2c98a"/>
  <ellipse cx="32" cy="38" rx="2.7" ry="2" fill="#241a12"/>

  <!-- eyes -->
  <circle cx="25" cy="30" r="2.1" fill="#241a12"/>
  <circle cx="39" cy="30" r="2.1" fill="#241a12"/>
</svg>
`;

const outDir = path.join(__dirname, "..", "public");
const appDir = path.join(__dirname, "..", "src", "app");

async function main() {
  const buf = Buffer.from(svg);

  await sharp(buf).resize(32, 32).png().toFile(path.join(outDir, "favicon-32x32.png"));
  await sharp(buf).resize(16, 16).png().toFile(path.join(outDir, "favicon-16x16.png"));
  await sharp(buf).resize(180, 180).png().toFile(path.join(outDir, "apple-touch-icon.png"));
  await sharp(buf).resize(192, 192).png().toFile(path.join(outDir, "icon-192.png"));
  await sharp(buf).resize(512, 512).png().toFile(path.join(outDir, "icon-512.png"));

  // Next.js App Router picks up src/app/favicon.ico automatically.
  // sharp doesn't write .ico directly, so build a 32x32 PNG and reuse it as the ico bytes
  // via the `to-ico` free path: write a simple single-frame ICO manually.
  const png32 = await sharp(buf).resize(32, 32).png().toBuffer();
  const ico = pngToIco(png32, 32);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico);

  console.log("favicon assets written");
}

// Minimal single-image ICO container wrapping one 32x32 PNG (modern browsers/OS support PNG-in-ICO)
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(6 + 16, 12); // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
