#!/usr/bin/env node
// Audit the seed.tsx asset references against what's actually on disk.
//
// For every imgUrl / cornerUrl / cornerInteriorUrl in src/context/seed.tsx,
// check whether the corresponding file exists under public/assets/.
// Also: for every SVG file on disk under public/assets/Tile or public/assets/Border,
// check whether the seed references it.
//
// Output: a report of missing/orphaned assets per family.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const seedPath = path.join(repoRoot, 'src/context/seed.tsx');
const assetsDir = path.join(repoRoot, 'public/assets');

const seedText = fs.readFileSync(seedPath, 'utf8');

// Pull every '../assets/...' occurrence out of the seed
const urlPattern = /['"]\.\.\/assets\/([^'"]+)['"]/g;
const referenced = new Set();
for (const m of seedText.matchAll(urlPattern)) {
  referenced.add(m[1]);
}

// Walk public/assets and collect all SVGs under Tile/ and Border/
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const onDisk = walk(assetsDir).map((p) => path.relative(assetsDir, p));
const onDiskSet = new Set(onDisk);

// Missing = referenced by seed but not on disk
const missing = [...referenced].filter((r) => !onDiskSet.has(r)).sort();

// Orphaned = on disk under Tile/ or Border/ but not referenced by seed
const orphaned = onDisk
  .filter(
    (p) =>
      (p.startsWith('Tile/') || p.startsWith('Border/')) &&
      p.endsWith('.svg') &&
      !referenced.has(p)
  )
  .sort();

// Group by family for readable output
function byFamily(paths) {
  const out = {};
  for (const p of paths) {
    const [kind, family] = p.split('/');
    const key = `${kind}/${family}`;
    (out[key] ??= []).push(p);
  }
  return out;
}

const missingByFamily = byFamily(missing);
const orphanedByFamily = byFamily(orphaned);

console.log(`=== Seed references: ${referenced.size}`);
console.log(`=== On disk under Tile/ or Border/: ${onDisk.filter((p) => (p.startsWith('Tile/') || p.startsWith('Border/')) && p.endsWith('.svg')).length} SVGs`);
console.log();

console.log('=== MISSING (seed references file, file does not exist) ===');
for (const [family, files] of Object.entries(missingByFamily)) {
  console.log(`  ${family}: ${files.length}`);
  for (const f of files) console.log(`    - ${f}`);
}
if (!Object.keys(missingByFamily).length) console.log('  (none)');
console.log();

console.log('=== ORPHANED (file on disk, not referenced by seed) ===');
for (const [family, files] of Object.entries(orphanedByFamily)) {
  console.log(`  ${family}: ${files.length}`);
  for (const f of files.slice(0, 5)) console.log(`    - ${f}`);
  if (files.length > 5) console.log(`    ... and ${files.length - 5} more`);
}
if (!Object.keys(orphanedByFamily).length) console.log('  (none)');
