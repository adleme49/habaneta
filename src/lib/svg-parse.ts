// SVG parsing helpers.
//
// When a user uploads an SVG tile, we need to discover which layers
// exist in the file so the editor can paint them individually. The
// convention (inherited from the 2020 Antique Colonial assets) is:
//
//   <path class="colora stN" fill="#hex" .../>
//
// where stN is the layer id. This module parses the SVG text, finds
// every `colora st*` class, and extracts the default fill from the
// first element in each layer. It's permissive — unknown classes are
// skipped, missing fills fall back to white.

import { Dict } from '../context/interfaces';
import { sanitizeSvg } from './svg-sanitize';

/**
 * Result of inspecting an SVG blob.
 *
 *   svgText   the raw SVG text (data URL or inline; used to render a preview
 *             and to store as a blob URL once persisted)
 *   layers    map of layer id → detected fill color. Stable key order
 *             (st0, st1, st2, ...) when possible.
 */
export interface ParsedSvg {
  svgText: string;
  layers: Dict<string>;
}

/**
 * Parse an uploaded SVG File into a raw text blob and a layers map.
 * Throws if the file isn't valid XML or has no `colora st*` classes
 * at all — those get surfaced to the form as validation errors.
 */
export async function parseSvgFile(file: File): Promise<ParsedSvg> {
  const rawText = await file.text();

  // Sanitize BEFORE doing anything else. The sanitized text is what
  // we parse, store, and render; the raw input is discarded. If
  // sanitization leaves nothing usable, sanitizeSvg throws.
  const svgText = sanitizeSvg(rawText);

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Not a valid SVG file.');
  }

  const layers = extractLayers(doc);
  if (Object.keys(layers).length === 0) {
    throw new Error(
      'No recolorable layers found. Habaneta tiles need shapes with class="colora stN".'
    );
  }

  return { svgText, layers };
}

function extractLayers(doc: Document): Dict<string> {
  const layers: Dict<string> = {};

  // Find every element whose class list contains "colora" AND an st* class.
  const nodes = doc.querySelectorAll('[class~="colora"]');
  nodes.forEach((el) => {
    const classAttr = el.getAttribute('class') ?? '';
    const match = classAttr.match(/\bst(\d+)\b/);
    if (!match) return;
    const layerId = `st${match[1]}`;
    if (layers[layerId] !== undefined) return; // first one wins

    const fill = readFill(el);
    layers[layerId] = fill;
  });

  // Sort by layer index for predictable key order.
  return Object.fromEntries(
    Object.entries(layers).sort(
      ([a], [b]) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10)
    )
  );
}

/**
 * Read a fill color from an SVG element. Checks the inline `fill`
 * attribute first, then the computed style. Falls back to `#ffffff`
 * if nothing is set (common when the CSS lives in a parent style tag
 * and isn't resolvable at parse time).
 */
function readFill(el: Element): string {
  const fillAttr = el.getAttribute('fill');
  if (fillAttr && fillAttr !== 'none') return fillAttr;

  const styleAttr = el.getAttribute('style') ?? '';
  const styleMatch = styleAttr.match(/fill:\s*([^;]+)/);
  if (styleMatch && styleMatch[1] !== 'none') return styleMatch[1].trim();

  return '#ffffff';
}
