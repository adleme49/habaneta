// Encode / decode a Habaneta design into a URL hash so links like
//
//   https://app/home#d=eyJmIjp7InMiOiJjb250ZW1wb3Jhcnkv...
//
// fully restore someone else's working state — which floor + border
// they picked, what colors they painted each layer, how many grid
// body rows, which ambient scene. No backend needed; the whole
// design fits in a few hundred bytes of base64-ish JSON.
//
// Shape (compact field names to keep URLs short):
//
//   {
//     f?: { s: sourceId, o: Dict<string> },  // floor instance
//     b?: { s: sourceId, o: Dict<string> },  // border instance
//     r?: number,                             // grid body rows
//     a?: AmbientId                           // selected ambient
//   }
//
// Base64 is URL-unsafe by default (contains `/` and `+`), so we
// swap to URL-safe characters and strip padding. Decoding reverses
// the swap before calling atob.

import { TileInstance } from './library';
import { AmbientId } from './ambients';

export interface DesignState {
  floor?: TileInstance;
  border?: TileInstance;
  gridBodyRows?: number;
  selectedAmbientId?: AmbientId;
}

interface CompactDesign {
  f?: { s: string; o: Record<string, string> };
  b?: { s: string; o: Record<string, string> };
  r?: number;
  a?: AmbientId;
}

const HASH_PREFIX = 'd=';

export function encodeDesign(state: DesignState): string {
  const compact: CompactDesign = {};
  if (state.floor) compact.f = { s: state.floor.sourceId, o: state.floor.layerOverrides };
  if (state.border) compact.b = { s: state.border.sourceId, o: state.border.layerOverrides };
  if (state.gridBodyRows !== undefined) compact.r = state.gridBodyRows;
  if (state.selectedAmbientId) compact.a = state.selectedAmbientId;
  return base64UrlEncode(JSON.stringify(compact));
}

export function decodeDesign(encoded: string): DesignState | null {
  try {
    const json = base64UrlDecode(encoded);
    const compact = JSON.parse(json) as CompactDesign;
    const state: DesignState = {};
    if (compact.f?.s) {
      state.floor = { sourceId: compact.f.s, layerOverrides: compact.f.o ?? {} };
    }
    if (compact.b?.s) {
      state.border = { sourceId: compact.b.s, layerOverrides: compact.b.o ?? {} };
    }
    if (typeof compact.r === 'number') state.gridBodyRows = compact.r;
    if (compact.a === 'bathroom' || compact.a === 'kitchen') {
      state.selectedAmbientId = compact.a;
    }
    return state;
  } catch {
    return null;
  }
}

/**
 * Build a shareable absolute URL for the current design. Prefers
 * `window.location.origin` so it works in any deploy environment;
 * falls back to a relative /home#... URL in SSR-ish contexts.
 */
export function buildShareUrl(state: DesignState): string {
  const encoded = encodeDesign(state);
  const hash = `${HASH_PREFIX}${encoded}`;
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/home#${hash}`;
  }
  return `/home#${hash}`;
}

/** Parse a design hash out of the current `window.location.hash`. */
export function readDesignHash(): DesignState | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return decodeDesign(hash.slice(HASH_PREFIX.length));
}

// --- base64url helpers ---

function base64UrlEncode(text: string): string {
  // btoa handles arbitrary ASCII/Latin-1. JSON.stringify output is
  // ASCII-safe so this is fine.
  const b64 = btoa(text);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(encoded: string): string {
  let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  // Re-pad so atob accepts it.
  while (b64.length % 4) b64 += '=';
  return atob(b64);
}
