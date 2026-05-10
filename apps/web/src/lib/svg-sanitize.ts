// SVG sanitization.
//
// Uploaded tiles are user-controlled input that ends up inlined into
// the DOM by react-svg. Without sanitization a crafted .svg containing
// <script>, on* handlers, or xlink:href to a remote URL would execute
// in the app origin — which means full access to localStorage
// (habaneta:presets), IndexedDB (habaneta:user-tiles), and eventually
// any auth tokens.
//
// DOMPurify's built-in SVG profile strips all script execution
// vectors. We additionally block href/xlink:href that aren't internal
// fragment references, because an <image href="http://attacker..."
// /> would still leak a tracking beacon.
//
// Concurrency caveat: this helper installs a hook on the *singleton*
// DOMPurify instance via `addHook` and removes it in `finally`. Calls
// from a single JS turn are safe (the addHook → sanitize → removeHook
// runs synchronously before the event loop yields). If a future code
// path runs `sanitizeSvg` concurrently across `await` boundaries (e.g.
// parallel-parsing many atoms in a v3 multi-atom pipeline), the hook
// state will interleave. Switch to `DOMPurify(window).sanitize(...)`
// per-call instances if that day comes.

import DOMPurify from 'dompurify';

/**
 * Return a safe version of the given SVG text, or throw if it's
 * unusable. Non-mutating: the input string is not touched.
 */
export function sanitizeSvg(svgText: string): string {
  // Use a one-shot hook to reject external references. DOMPurify
  // calls this per-attribute during sanitization.
  const hookName = 'habaneta-svg-external-refs';
  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    const name = data.attrName;
    if (name === 'href' || name === 'xlink:href') {
      const value = data.attrValue ?? '';
      // Allow only internal fragment refs ("#gradient-1") and
      // data URLs that don't nest executables. Everything else
      // gets dropped.
      if (!value.startsWith('#') && !value.startsWith('data:image/')) {
        data.keepAttr = false;
      }
    }
  });

  try {
    // USE_PROFILES svg+svgFilters already blocks <script>, every
    // on* handler, and known event vectors. We deliberately DO NOT
    // add FORBID_TAGS: ['foreignObject'] on top: tested empirically,
    // doing so makes DOMPurify strip children that *follow* a
    // forbidden node elsewhere in the tree — a hostile fixture with
    // <foreignObject/> followed by <rect class="colora st0"/> lost
    // the rect entirely. The SVG profile already refuses
    // foreignObject through its allowlist, which is safer.
    const clean = DOMPurify.sanitize(svgText, {
      USE_PROFILES: { svg: true, svgFilters: true },
      // KEEP_CONTENT = keep text/element children of a stripped node
      // rather than dropping them along with the parent. Without
      // this, a tag that DOMPurify refuses to allowlist takes its
      // entire subtree with it, which can silently remove a
      // legitimate <rect class="colora stN"/> if it happens to
      // follow e.g. an unknown wrapper element.
      KEEP_CONTENT: true,
    });
    if (!clean || !clean.includes('<svg')) {
      throw new Error(
        'SVG was empty or fundamentally malformed after sanitization'
      );
    }
    return clean;
  } finally {
    DOMPurify.removeHook('uponSanitizeAttribute');
  }
}
