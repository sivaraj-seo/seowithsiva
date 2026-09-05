/**
 * Normalizes article banner images so a single file works in every placement.
 *
 * One image per article is referenced by the `image:` frontmatter field and
 * rendered in three places at different aspect ratios:
 *
 *   - articles listing card thumbnail  ~330x200  (1.65:1)
 *   - article page hero                ~976x260  (3.75:1, capped by max-height)
 *   - related-articles thumbnail       ~300x160  (1.88:1)
 *
 * All three use object-fit:cover, so a banner far wider than the card ratio
 * gets its sides cut off - which silently decapitated the headline text on
 * 1200x320 banners. Padding the short axis out to 1.9:1 keeps the artwork
 * inside the crop box of every placement at once.
 *
 * The script pads with the image's own edge colour, so the seam is invisible
 * on the flat-background banners this site uses. Banners whose edges aren't a
 * flat colour are left alone and reported, since padding those would show.
 *
 * It also regenerates src/data/imageDims.ts from the images on disk, so the
 * width/height attributes that prevent layout shift can't drift out of sync.
 *
 * Idempotent: a banner already at the target ratio is skipped, so this is safe
 * to run on every build (wired up as `prebuild` in package.json).
 */

import { readdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const articlesDir = `${root}src/content/articles`;
const publicDir = `${root}public`;
const dimsFile = `${root}src/data/imageDims.ts`;

/** Target banner ratio. 1200x630 is also the ratio Open Graph previews expect. */
const TARGET_RATIO = 1200 / 630;
/**
 * Ratios that survive every placement untouched. The tightest crop box is the
 * listing card at 1.65:1, so anything from roughly square up to ~2.2:1 loses
 * only margins. This range deliberately covers 16:9 (1.78) and 1.91:1 so the
 * usual banner exports pass through byte-for-byte; only genuinely extreme
 * letterbox or portrait art gets padded.
 */
const SAFE_RATIO = { min: 1.3, max: 2.2 };
/** Max per-channel spread across an edge for it to count as a flat colour. */
const FLAT_EDGE_TOLERANCE = 6;

const encoders = {
  '.png': img => img.png({ compressionLevel: 9 }),
  '.webp': img => img.webp({ quality: 88 }),
  '.jpg': img => img.jpeg({ quality: 88, mozjpeg: true }),
  '.jpeg': img => img.jpeg({ quality: 88, mozjpeg: true }),
};

/** Collects the `image:` frontmatter value from every article. */
function bannerPaths() {
  const paths = new Set();
  for (const file of readdirSync(articlesDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(`${articlesDir}/${file}`, 'utf-8');
    const image = raw.match(/^image:\s*"([^"]+)"/m)?.[1];
    if (!image) {
      console.warn(`  ! ${file} has no image: field`);
      continue;
    }
    if (!existsSync(`${publicDir}${image}`)) {
      throw new Error(`${file} references ${image}, which does not exist in public/`);
    }
    paths.add(image);
  }
  return [...paths].sort();
}

/**
 * Returns the uniform colour of one edge, or null when the edge isn't flat.
 * `pick` walks the edge and yields the offset of each pixel in the raw buffer.
 */
function edgeColour({ data, info }, pick) {
  const channels = [[], [], []];
  for (const offset of pick(info)) {
    for (let c = 0; c < 3; c++) channels[c].push(data[offset + c]);
  }
  const colour = {};
  for (const [c, key] of [[0, 'r'], [1, 'g'], [2, 'b']]) {
    const values = channels[c];
    if (Math.max(...values) - Math.min(...values) > FLAT_EDGE_TOLERANCE) return null;
    colour[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }
  return colour;
}

const rowPicker = y => ({ width, channels }) =>
  Array.from({ length: width }, (_, x) => (y * width + x) * channels);

const columnPicker = x => ({ width, height, channels }) =>
  Array.from({ length: height }, (_, y) => (y * width + x) * channels);

/** Pads one banner to the target ratio. Returns its final dimensions. */
async function normalize(imagePath) {
  const file = `${publicDir}${imagePath}`;
  const extension = imagePath.slice(imagePath.lastIndexOf('.')).toLowerCase();
  const encode = encoders[extension];
  const { width, height } = await sharp(file).metadata();
  const ratio = width / height;

  if (ratio >= SAFE_RATIO.min && ratio <= SAFE_RATIO.max) {
    console.log(`  = ${imagePath} ${width}x${height} (${ratio.toFixed(2)}:1) crops cleanly`);
    return { width, height };
  }
  if (!encode) {
    console.warn(`  ! ${imagePath} is ${ratio.toFixed(2)}:1 but ${extension} can't be re-encoded`);
    return { width, height };
  }

  const raw = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const tooWide = ratio > TARGET_RATIO;

  // Pad the short axis. Each side takes its own edge colour, so a banner with
  // different colours top and bottom still pads cleanly.
  const [nearPick, farPick] = tooWide
    ? [rowPicker(0), rowPicker(height - 1)]
    : [columnPicker(0), columnPicker(width - 1)];
  const near = edgeColour(raw, nearPick);
  const far = edgeColour(raw, farPick);

  if (!near || !far) {
    console.warn(
      `  ! ${imagePath} is ${ratio.toFixed(2)}:1 but its edges aren't a flat colour - ` +
        `padding would be visible, so it was left alone. Re-export it at 1200x630.`
    );
    return { width, height };
  }

  const total = tooWide
    ? Math.round(width / TARGET_RATIO) - height
    : Math.round(height * TARGET_RATIO) - width;
  const nearSide = Math.floor(total / 2);
  const farSide = total - nearSide;

  // sharp takes a single background per extend(), so uneven edge colours need
  // one pass per side.
  let pipeline = sharp(file);
  if (tooWide) {
    pipeline = pipeline.extend({ top: nearSide, bottom: 0, background: near });
    pipeline = sharp(await encode(pipeline).toBuffer()).extend({
      bottom: farSide,
      top: 0,
      background: far,
    });
  } else {
    pipeline = pipeline.extend({ left: nearSide, right: 0, background: near });
    pipeline = sharp(await encode(pipeline).toBuffer()).extend({
      right: farSide,
      left: 0,
      background: far,
    });
  }

  const temp = `${file}.tmp`;
  const info = await encode(pipeline).toFile(temp);
  renameSync(temp, file);
  console.log(
    `  + ${imagePath} ${width}x${height} -> ${info.width}x${info.height} ` +
      `(${(info.size / 1024).toFixed(1)}KB)`
  );
  return { width: info.width, height: info.height };
}

/** Rewrites imageDims.ts so the width/height attributes match the files. */
function writeDims(dims) {
  const entries = Object.entries(dims)
    .map(([path, { width, height }]) => `  '${path}': { width: ${width}, height: ${height} },`)
    .join('\n');

  const contents = `// GENERATED by scripts/normalize-banners.mjs - do not edit by hand.
// Intrinsic pixel dimensions for article banner images, used to set explicit
// width/height on <img> tags and prevent layout shift (CLS).
export const imageDims: Record<string, { width: number; height: number }> = {
${entries}
};

const fallback = { width: 1200, height: 630 };

export function getImageDims(src: string) {
  return imageDims[src] || fallback;
}
`;

  const previous = existsSync(dimsFile) ? readFileSync(dimsFile, 'utf-8') : '';
  if (previous === contents) {
    console.log('  = src/data/imageDims.ts unchanged');
    return;
  }
  writeFileSync(dimsFile, contents);
  console.log('  + src/data/imageDims.ts regenerated');
}

console.log('Normalizing article banners to 1.9:1...');
const dims = {};
for (const path of bannerPaths()) {
  dims[path] = await normalize(path);
}
writeDims(dims);
