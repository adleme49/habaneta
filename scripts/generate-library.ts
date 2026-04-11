#!/usr/bin/env -S npx tsx
// Generates public/library.json from the legacy seed.tsx structure.
//
// Run with:  npm run generate-library
//
// This is a one-way converter: once the JSON exists, the app loads
// the library from it (public/library.json). Rerun this script only
// if you edit the underlying seed.tsx data (which should be rare —
// new tiles will eventually come through the library admin UI).

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { tilesFam, borderFam } from '../src/context/seed';
import type { IFloor, IBorder } from '../src/context/interfaces';
import type { TileSource } from '../src/lib/library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'library.json');

/**
 * Derive a stable slug from a tile's imgUrl and family name.
 *   "../assets/Tile/Contemporary/l05.svg"   → "contemporary/l05"
 *   "../assets/Border/Victorian/l49.1.svg"  → "victorian/l49"
 * Trailing `.<digit>` (used by border corner variants) is stripped
 * so the three corner files map to a single source.
 */
function slugFromUrl(url: string, family: string): string {
  const file = url.split('/').pop() ?? url;
  const base = file
    .replace(/\.svg$/, '')
    .replace(/\.\d+$/, '');
  return `${family.toLowerCase()}/${base}`;
}

/**
 * Convert the relative "../assets/..." paths (which worked by accident
 * in the legacy Ionic app) to absolute "/assets/..." paths so the
 * browser can fetch them from public/ regardless of current route.
 */
function normalize(url: string | undefined): string | undefined {
  return url?.replace(/^\.\.\//, '/');
}

const library: TileSource[] = [];

for (const family of tilesFam) {
  for (const tile of family.types as IFloor[]) {
    if (!tile.imgUrl) continue;
    library.push({
      id: slugFromUrl(tile.imgUrl, family.name),
      kind: 'floor',
      family: family.name,
      displayName: tile.name,
      svgUrl: normalize(tile.imgUrl)!,
      layers: { ...(tile.layers ?? {}) },
      grids: tile.grids,
      source: 'builtin',
    });
  }
}

for (const family of borderFam) {
  for (const tile of family.types as IBorder[]) {
    if (!tile.imgUrl) continue;
    library.push({
      id: slugFromUrl(tile.imgUrl, family.name),
      kind: 'border',
      family: family.name,
      displayName: tile.name,
      svgUrl: normalize(tile.imgUrl)!,
      cornerUrl: normalize(tile.cornerUrl),
      cornerInteriorUrl: normalize(tile.cornerInteriorUrl),
      layers: { ...(tile.layers ?? {}) },
      source: 'builtin',
    });
  }
}

writeFileSync(outPath, JSON.stringify(library, null, 2) + '\n', 'utf8');

console.log(
  `Wrote ${library.length} tiles to ${path.relative(process.cwd(), outPath)}`
);
