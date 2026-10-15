import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Brand Yellow Background with rounded corners matching C Taxi logo -->
  <rect width="512" height="512" rx="110" fill="#FFBF00"/>
  <!-- Bold C Taxi 'C' Glyph -->
  <path d="M 355 180 C 330 145 292 128 245 128 C 168 128 116 182 116 256 C 116 330 168 384 245 384 C 292 384 330 367 355 332 L 308 298 C 292 321 270 334 243 334 C 192 334 166 298 166 256 C 166 214 192 178 243 178 C 270 178 292 191 308 214 Z" fill="#171717"/>
</svg>`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG favicon
  const svgPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('Saved favicon.svg');

  // 2. Generate PNG 32x32
  await sharp(Buffer.from(svgContent))
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Saved favicon-32x32.png');

  // 3. Generate PNG 16x16
  await sharp(Buffer.from(svgContent))
    .resize(16, 16)
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Saved favicon-16x16.png');

  // 4. Generate Apple Touch Icon 180x180
  await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved apple-touch-icon.png');

  // 5. Generate favicon.ico (32x32 PNG saved as ico)
  await sharp(Buffer.from(svgContent))
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Saved favicon.ico');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
